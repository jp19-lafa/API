import { BaseRoute } from "../base.route";
import { AuthController } from "./auth.controller";

export class AuthRoute extends BaseRoute {

  protected readonly controller: AuthController = new AuthController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.post('/login', [], this.controller.login);
    this.router.post('/refresh', [], this.controller.refresh);
    this.router.post('/register', [], this.controller.register);
  }
}