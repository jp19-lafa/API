import { BaseController } from "@modules/base.controller";
import { MqttService } from "./mqtt.service";
import { Mqtt } from "@mqtt";

export class ActuatorsController extends BaseController {

  protected readonly mqttService: MqttService;

  constructor() {
    super();
    this.mqttService = new MqttService();
    this.initSubscription();
  }

  private initSubscription() {
    Mqtt.Instance.sensorUpdate.subscribe(update => {
      this.mqttService.handleSensorUpdate(update);
    });
  }

}