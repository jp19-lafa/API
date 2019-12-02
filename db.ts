import { connect, connection, Connection } from 'mongoose';

// Config
import config from 'config';

// Models
import { UserModel, User } from './models/user.model';
import { NodeModel, Node } from '@models/node.model';
import { SensorDataPointModel, SensorDataPoint } from '@models/sensorDataPoint.model';
import { SensorModel, Sensor } from '@models/sensor.model';
import { ActuatorDataPointModel, ActuatorDataPoint } from '@models/actuatorDataPoint.model';
import { ActuatorModel, Actuator } from '@models/actuator.model';

declare interface IModels {
  User: UserModel;
  Node: NodeModel;
  Sensor: SensorModel;
  SensorDataPoint: SensorDataPointModel;
  Actuator: ActuatorModel;
  ActuatorDataPoint: ActuatorDataPointModel;
}

export class Database {

  private static instance: Database;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    const dbConfig: any = config.get('database');
    connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    this._db = connection;
    this._db.on('open', this.connected);
    this._db.on('error', this.error);

    this._models = {
      User: new User().model,
      Node: new Node().model,
      Sensor: new Sensor().model,
      SensorDataPoint: new SensorDataPoint().model,
      Actuator: new Actuator().model,
      ActuatorDataPoint: new ActuatorDataPoint().model
    }
  }

  public static get Models() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance._models;
  }

  private connected() {
    console.log('Mongoose has connected');
  }

  private error(error: any) {
    console.log('Mongoose has errored', error);
  }
}