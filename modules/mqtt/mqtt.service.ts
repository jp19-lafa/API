import { get as config } from 'config';
import { BaseService } from "@modules/base.service";
import { INode } from "@models/node.model";
import { IActuator } from "@models/actuator.model";
import { connect, MqttClient, Packet, Client } from 'mqtt';
import { v4 } from 'uuid';

export class MqttService extends BaseService {

  protected readonly uid: string = v4();
  protected client: MqttClient;
  protected mqttConfig: any = config('mqtt');

  constructor() {
    super();

    this.client = connect(this.mqttConfig.url, {
      clientId: this.uid,
      username: `core-server-${ this.uid }`,
      password: this.mqttConfig.key
    });

    this.client.on('connect', () => {
      console.log(`Connected to MQTT Broker (core-server-${ this.uid })`);
      // client.subscribe('presence', function (err) {
      //   if (!err) {
      //     client.publish('presence', 'Hello mqtt')
      //   }
      // })
    });

    this.client.on('message', this.messageRecieved);
  }

  protected messageRecieved = (topic, message) => {
    // Recieved message
  }

  // public async handleSensorUpdate(update: IOUpdate) {
  //   let node: INode = await this.nodesService.getNodeByMAC(update.client.id);
  //   let sensor: ISensor = (node.sensors as ISensor[]).filter(sensor => sensor.type === update.device.name)[0];

  //   await this.sensorsService.updateSensorDataPoint(sensor.id, parseFloat(update.packet.payload.toString()));
  // }

  public sendActuatorUpdateMessage(node: INode, actuator: IActuator, value: number) {
    return new Promise<IActuator>((resolve, reject) => {
      this.client.publish(`${node.macAddress}/actuator/${actuator.type}`, value.toString(), {
        qos: 2,
        retain: false
      }, (err) => {
        resolve(actuator);
      });
    });
  }

}

export interface IODevice {
  type: IOType;
  name: string;
}

export enum IOType {
  sensor = 'sensor',
  actuator = 'actuator'
}

export interface IOUpdate {
  device: IODevice,
  packet: Packet,
  client: Client
}