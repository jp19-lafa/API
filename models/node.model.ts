import { Schema, model, Document, Model, Types } from 'mongoose';
import { IUser } from './user.model';
import { ISensor } from './sensor.model';
import { IActuator } from './actuator.model';

export declare interface INode extends Document {
  label: string,
  macAddress: string,
  authorizationKey: string,
  status: boolean,
  liveSince: Date,
  allowPublicStats: boolean,
  members: Types.ObjectId[] | IUser[],
  sensors: Types.ObjectId[] | ISensor[],
  actuators: Types.ObjectId[] | IActuator[]
}

export interface NodeModel extends Model<INode> { };

export class Node {

  private _model: Model<INode>;

  constructor() {
    const schema = new Schema({
      label: String,
      macAddress: { type: String, required: true, unique: true },
      authorizationKey: { type: String, required: true },
      pairingKey: { type: String, required: true },
      status: { type: Boolean, default: false, required: true },
      liveSince: { type: Date, default: Date.now },
      allowPublicStats: { type: Boolean, default: false },
      members: [{ type: Types.ObjectId, ref: "User" }],
      sensors: [{ type: Types.ObjectId, ref: "Sensor" }],
      actuators: [{ type: Types.ObjectId, ref: "Actuator" }]
    });

    this._model = model<INode>('Node', schema);
  }

  public get model(): Model<INode> {
    return this._model;
  }
}