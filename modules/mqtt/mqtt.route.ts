import { BaseRoute } from "../base.route";
import { MqttController } from "./mqtt.controller";

export class MqttRoute extends BaseRoute {

  protected readonly controller: MqttController = new MqttController();

  constructor() {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.post('/authenticate', [], this.controller.Authenticate);
    this.router.post('/status', [], this.controller.Status);
    this.router.post('/status/reset', [], this.controller.ResetStatus);
    this.router.post('/sensor', [], this.controller.UpdateSensor);
  }
}