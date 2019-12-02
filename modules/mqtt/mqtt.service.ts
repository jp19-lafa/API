import { BaseService } from "@modules/base.service";
import { IOUpdate } from "@mqtt";
import { Packet } from "mosca";

export class MqttService extends BaseService {

  constructor() {
    super();
  }

  public handleSensorUpdate(update: IOUpdate) {
    console.log('sensorUpdate:', update);
  }

}