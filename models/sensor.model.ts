import { Schema, model, Document, Model } from 'mongoose';

export declare interface ISensor extends Document {
  value: number,
  timestamp: Date,
  type: SensorType
}

export declare enum SensorType {
  AirTemperature = 'airtemp',
  WaterTemperature = 'watertemp',
  LightStrength = 'lightstr',
  AirHumidity = 'airhumidity',
  WaterPH = 'waterph'
}

export interface SensorModel extends Model<ISensor> { };

export class Sensor {

  private _model: Model<ISensor>;

  constructor() {
    const schema = new Schema({
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      type: {
        type: String,
        enum: ['undefined', 'airtemp', 'watertemp', 'lightstr', 'airhumidity', 'waterph'],
        default: 'undefined'
      }
    });

    this._model = model<ISensor>('Sensor', schema);
  }

  public get model(): Model<ISensor> {
    return this._model;
  }
}