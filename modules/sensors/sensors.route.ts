import { BaseRoute } from "../base.route";
import { SensorsController } from "./sensors.controller";

export class SensorsRoute extends BaseRoute {

  protected readonly controller: SensorsController = new SensorsController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.get('/:id', [], this.controller.getSensorDataPoints);
  }
}