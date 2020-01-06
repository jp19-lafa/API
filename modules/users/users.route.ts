import { BaseRoute } from "../base.route";
import { UsersController } from "./users.controller";

export class UsersRoute extends BaseRoute {

  protected readonly controller: UsersController = new UsersController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.get('/', [], this.controller.getAllUsers);
    this.router.get('/me', [], this.controller.getCurrentUser);
  }
}