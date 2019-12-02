import { Schema, model, Document, Model, Types } from 'mongoose';

export declare interface ISensorDataPoint extends Document {
  value: number,
  timestamp: Date
}

export interface SensorDataPointModel extends Model<ISensorDataPoint> { };

export class SensorDataPoint {

  private _model: Model<ISensorDataPoint>;

  constructor() {
    const schema = new Schema({
      value: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now, required: true },
      parent: { type: Types.ObjectId, ref: "Sensor" }
    });

    this._model = model<ISensorDataPoint>('SensorDataPoint', schema);
  }

  public get model(): Model<ISensorDataPoint> {
    return this._model;
  }
}