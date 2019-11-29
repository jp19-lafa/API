import { Schema, model, Document, Model, Types } from 'mongoose';

export declare interface IActuatorDataPoint extends Document {
  value: number,
  timestamp: Date
}

export interface ActuatorDataPointModel extends Model<IActuatorDataPoint> { };

export class ActuatorDataPoint {

  private _model: Model<IActuatorDataPoint>;

  constructor() {
    const schema = new Schema({
      value: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now, required: true },
      parent: [{ type: Types.ObjectId, ref: "Actuator" }]
    });

    this._model = model<IActuatorDataPoint>('ActuatorDataPoint', schema);
  }

  public get model(): Model<IActuatorDataPoint> {
    return this._model;
  }
}