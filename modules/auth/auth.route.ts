import { BaseRoute } from "../base.route";
import { AuthController } from "./auth.controller";
import { body } from 'express-validator';

export class AuthRoute extends BaseRoute {

  protected readonly controller: AuthController = new AuthController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.post('/login', [
      body('email').isEmail().escape().trim(),
      body('password').isString().isLength({ min: 8, max: 65536 }).escape().trim()
    ], this.controller.login);

    this.router.post('/refresh', [
      body('refresh').isUUID(4).escape().trim()
    ], this.controller.refresh);
  
    this.router.post('/register', [
      body('email').isEmail().escape().trim(),
      body('password').isString().isLength({ min: 8, max: 65536 }).escape().trim(),
      body('firstname').isString().isLength({ min: 2, max: 256 }).escape().trim(),
      body('lastname').isString().isLength({ min: 2, max: 256 }).escape().trim()
    ], this.controller.register);
  }
}