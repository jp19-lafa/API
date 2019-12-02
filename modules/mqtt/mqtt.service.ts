import { BaseService } from "@modules/base.service";
import { IOUpdate, Mqtt } from "@mqtt";
import { INode } from "@models/node.model";
import { IActuator } from "@models/actuator.model";
import { Message } from "mosca";

export class MqttService extends BaseService {

  constructor() {
    super();
  }

  public handleSensorUpdate(update: IOUpdate) {
    console.log('sensorUpdate:', update);
  }

  public sendActuatorUpdateMessage(node: INode, actuator: IActuator, value: number) {
    return new Promise<IActuator>((resolve, reject) => {
      let message: Message = {
        topic: `${node.macAddress}/actuator/${actuator.type}`,
        payload: value,
        qos: 2,
        retain: false
      };
  
      Mqtt.Server.publish(message, () => {
        resolve(actuator);
      });
    });
  }

}