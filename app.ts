import express from 'express';
import config from 'config';
import sentry from "@sentry/node";

// Routes
import { AuthRoute } from './modules/auth/auth.route';
import { NodesRoute } from './modules/nodes/nodes.route';
import { SensorsRoute } from './modules/sensors/sensors.route';

// Middleware
import { AuthMiddleware } from '@modules/auth/auth.middleware';
import jwt from 'express-jwt';
import { DatabaseSeed } from './temp/db.seeds';
import { Mqtt } from './mqtt';
import { ActuatorsRoute } from '@modules/actuators/actuators.route';
import { readFileSync } from 'fs';

export class App {
  private readonly app: express.Application;
  private readonly port: number;

  private readonly authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.app = express();
    this.port = config.get('port');

    this.app.use(express.json());

    this.app.use(sentry.Handlers.requestHandler());

    this.app.use(jwt({
      secret: readFileSync("keys/private.key"),
      requestProperty: 'token'
    }).unless({
      path: [
        '/auth/login',
        '/auth/refresh',
        '/auth/register',
        '/public'
      ]
    }));

    this.app.use(this.unauthorizedException);

    this.app.use(this.authMiddleware.injectUser);

    this.initSentry();

    this.initRoutes();

    this.seedDB();
    

    // Force MQTT start (singleton)
    Mqtt.Server;
  }

  /**
   * Initialize Sentry
   */
  private initSentry() {
    if (config.has('debug.sentry') && !config.get('debug.sentry')) return;
    sentry.init({
      dsn: 'https://2d76762c67434792892887d13b2cdda6@sentry.io/1784742',
      environment: process.env.NODE_ENV
    });
  }

  /**
   * Initialize Routes
   */
  private initRoutes() {
    this.app.use('/auth', new AuthRoute().getRouter());
    this.app.use('/nodes', new NodesRoute().getRouter());
    this.app.use('/sensors', new SensorsRoute().getRouter());
    this.app.use('/actuators', new ActuatorsRoute().getRouter());
  }

  /**
   * InvalidToken Exception
   */
  private unauthorizedException(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res
        .status(401)
        .send({ error: "Unautorized", code: 401, reason: "Invalid Token" });
    }
  }

  /**
   * Start Listening
   */
  public listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port, () => {
        console.log('HTTP Server Running');
        resolve();
      });
    });
  }

  /**
   * Seed Database
   */
  public seedDB(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const seed = new DatabaseSeed();
      seed.seed().then(result => resolve);
    });
  }
}