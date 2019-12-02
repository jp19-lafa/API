import { Schema, model, Document, Model } from 'mongoose';

export declare interface IActuator extends Document {
  value: number,
  timestamp: Date,
  type: ActuatorType
}

export declare enum ActuatorType {
  LightIntensity = 'lightint',
  FlowPump = 'flowpump',
  FoodPump = 'foodpump'
}

export interface ActuatorModel extends Model<IActuator> { };

export class Actuator {

  private _model: Model<IActuator>;

  constructor() {
    const schema = new Schema({
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      type: {
        type: String,
        enum: ['undefined', 'lightint', 'flowpump', 'foodpump'],
        default: 'undefined'
      }
    });

    this._model = model<IActuator>('Actuator', schema);
  }

  public get model(): Model<IActuator> {
    return this._model;
  }
}