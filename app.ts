import express from 'express';
import config from 'config';
import sentry from "@sentry/node";

// Routes
import { AuthRoute } from './modules/auth/auth.route';

export class App {
  private readonly app: express.Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = config.get('port');

    this.app.use(express.json());

    this.initSentry();

    this.initRoutes();
  }

  /**
   * Initialize Sentry
   */
  private initSentry() {
    if(config.has('debug.sentry') && !config.get('debug.sentry')) return;
    sentry.init({
      dsn: 'https://2d76762c67434792892887d13b2cdda6@sentry.io/1784742',
      environment: process.env.NODE_ENV
    });
  }

  private initRoutes() {
    this.app.use('/auth', new AuthRoute().getRouter())
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
}