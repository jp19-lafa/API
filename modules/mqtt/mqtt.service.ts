import { BaseService } from "@modules/base.service";
import { Mqtt, IOUpdate } from "@mqtt";
import { Packet } from "mosca";

export class MqttService extends BaseService {

  constructor() {
    super();

    Mqtt.Instance.sensorUpdate.subscribe(update => {
      this.handleSensorUpdate(update);
    });
  }

  private handleSensorUpdate(update: IOUpdate) { }
  private handleActuatorUpdate(update: IOUpdate) { }

}