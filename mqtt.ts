// Config
import config from 'config';

import { Server, Client, Packet } from 'mosca';

import { Subject } from 'rxjs';

export class Mqtt {

  private static instance: Mqtt;

  private _server: Server;

  // Observables
  public clientConnected: Subject<Client> = new Subject<Client>();
  public clientDisconnected: Subject<Client> = new Subject<Client>();
  public sensorUpdate: Subject<IOUpdate> = new Subject<IOUpdate>();
  public actuatorUpdate: Subject<IOUpdate> = new Subject<IOUpdate>();

  private constructor() {

    const mqttConfig: any = config.get('mqtt');

    this._server = new Server({
      port: mqttConfig.port,
      backend: {
        type: "mongo",
        url: `mongodb://${mqttConfig.database.host}:${mqttConfig.database.port}/${mqttConfig.database.name}`,
        pubsubCollection: "ascoltatori",
        mongo: {}
      }
    });

    this._server.on('ready', this.started);
    this._server.on('error', this.error);

    this._server.on('clientConnected', (client) => this.clientConnected.next(client));
    this._server.on('clientDisconnected', (client) => this.clientDisconnected.next(client));
    this._server.on('published', (packet, client) => {
      if (!new RegExp('([0-9A-F]{2}[:]){5}([0-9A-F]{2})[/][a-z]+[/][a-z]+').test(packet.topic)) return;
      
      const update: IOUpdate = this.injectDevice(client, packet);

      switch (update.device.type) {
        case IOType.sensor:
          this.sensorUpdate.next(update);
          break;
        case IOType.actuator:
          this.actuatorUpdate.next(update);
          break;
      }
    });

  }

  public static get Server() {
    this.ensureCreated();
    return Mqtt.instance._server;
  }

  public static get Instance() {
    this.ensureCreated();
    return Mqtt.instance;
  }

  private static ensureCreated(): void {
    if (!Mqtt.instance) {
      Mqtt.instance = new Mqtt();
    }
  }

  private started() {
    console.log('Mosca has started');
  }

  private error(error: any) {
    console.log('Mosca has errored', error);
  }

  private injectDevice(client: Client, packet: Packet): IOUpdate {
    return {
      client: client,
      packet: packet,
      device: {
        type: IOType[packet.topic.split('/')[1]],
        name: packet.topic.split('/')[2]
      }
    };
  }
}

// Interfaces
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