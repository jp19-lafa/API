import { get as config } from 'config';
import { BaseService } from "@modules/base.service";
import { INode } from "@models/node.model";
import { IActuator } from "@models/actuator.model";
import { connect, MqttClient } from 'mqtt';
import { v4 } from 'uuid';

export class MqttService extends BaseService {

  protected readonly uid: string = v4();
  protected client: MqttClient;
  protected mqttConfig: any = config('mqtt');

  constructor() {
    super();

    this.client = connect(this.mqttConfig.url, {
      clientId: `core-server-${ this.uid }`,
      username: `core-server-${ this.uid }`,
      password: this.mqttConfig.key
    });

    this.client.on('connect', () => {
      console.log(`Connected to MQTT Broker (core-server-${ this.uid })`);
    });
  }

  public sendActuatorUpdateMessage(node: INode, actuator: IActuator, value: number) {
    return new Promise<IActuator>((resolve, reject) => {
      this.client.publish(`farmlab/${node.macAddress}/actuator/${actuator.type}`, value.toString(), {
        qos: 2,
        retain: false
      }, (err, packet) => {
        // FIXME This fails
      });
      resolve(actuator);
    });
  }

}