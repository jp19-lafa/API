import { BaseRoute } from "../base.route";
import { NodesController } from "./nodes.controller";

export class NodesRoute extends BaseRoute {

  protected readonly controller: NodesController = new NodesController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.get('/', [], this.controller.getMyNodes);
    this.router.get('/public', [], this.controller.getPublicNodes);
    this.router.get('/:id', [], this.controller.getMyNode);
    this.router.patch('/:id/actuator', [], this.controller.patchMyNodeActuator);
  }
}