import { BaseRoute } from "../base.route";
import { ActuatorsController } from "./actuators.controller";

export class ActuatorsRoute extends BaseRoute {

  protected readonly controller: ActuatorsController = new ActuatorsController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.get('/:id', [], this.controller.getActuator);
    this.router.patch('/:id', [], this.controller.patchActuator);
  }
}