import express, { Router } from 'express';
import { BaseController } from './base.controller';

export abstract class BaseRoute {
  
  protected abstract controller: BaseController;
  protected abstract initRoutes(): void;
  protected router: express.Router = Router({ mergeParams: true });

  public getRouter(): express.Router {
    return this.router;
  }

}