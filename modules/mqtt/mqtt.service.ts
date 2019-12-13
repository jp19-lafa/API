import { BaseService } from "@modules/base.service";
import { IOUpdate, Mqtt } from "@mqtt";
import { INode } from "@models/node.model";
import { IActuator } from "@models/actuator.model";
import { Message } from "mosca";
import { SensorsService } from "@modules/sensors/sensors.service";
import { NodesService } from "@modules/nodes/nodes.service";
import { ISensorDataPoint } from "@models/sensorDataPoint.model";
import { ISensor } from "@models/sensor.model";

export class MqttService extends BaseService {

  protected sensorsService: SensorsService = new SensorsService();
  protected nodesService: NodesService = new NodesService();

  constructor() {
    super();
  }

  public async handleSensorUpdate(update: IOUpdate) {
    let node: INode = await this.nodesService.getNodeByMAC(update.client.id);
    let sensor: ISensor = (node.sensors as ISensor[]).filter(sensor => sensor.type === update.device.name)[0];

    await this.sensorsService.updateSensorDataPoint(sensor.id, parseFloat(update.packet.payload.toString()));
  }

  public sendActuatorUpdateMessage(node: INode, actuator: IActuator, value: number) {
    return new Promise<IActuator>((resolve, reject) => {
      let message: Message = {
        topic: `${node.macAddress}/actuator/${actuator.type}`,
        payload: value.toString(),
        qos: 2,
        retain: false
      };
  
      Mqtt.Server.publish(message, (obj, packet) => {
        resolve(actuator);
      });
    });
  }

}