import express from 'express';
import { get as config } from 'config';
import { init, Handlers } from "@sentry/node";
import jwt from 'express-jwt';
import { DatabaseSeed } from './temp/db.seeds';
import { Mqtt } from './mqtt';
import { ActuatorsRoute } from '@modules/actuators/actuators.route';
import { readFileSync } from 'fs';
import cors from 'cors';

// Routes
import { AuthRoute } from './modules/auth/auth.route';
import { NodesRoute } from './modules/nodes/nodes.route';
import { SensorsRoute } from './modules/sensors/sensors.route';

// Middleware
import { AuthMiddleware } from '@modules/auth/auth.middleware';

export class App {
  private readonly app: express.Application;
  private readonly port: number;

  private readonly authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.app = express();
    this.port = config('port');

    this.app.use(express.json());

    this.app.use(Handlers.requestHandler({
      user: ['email']
    }));

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

    this.app.use(cors(this.corsOptionDelegate));

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
    if (!config('sentry')) return;
    init({
      dsn: config('sentry'),
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
   * Cors Option Delegate
   */
  private corsOptionDelegate(req, callback) {
    let whitelist: string[] = config('cors');
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  }

  /**
   * InvalidToken Exception
   */
  private unauthorizedException(err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res
        .status(498)
        .send(new Error('InvalidToken'));
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