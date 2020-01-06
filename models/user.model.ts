import { Schema, model, Document, Model } from 'mongoose';

export declare interface IUser extends Document {
  firstname: string,
  lastname: string,
  email: string,
  enabled: boolean,
  joined: Date,
  // Security
  role: UserRole,
  password: string,
  refreshToken?: string,
  passwordReset?: { token: string, expires: string }
}

export enum UserRole {
  default = 'default',
  admin = 'admin'
}

export interface UserModel extends Model<IUser> { };

export class User {

  private _model: Model<IUser>;

  constructor() {
    const schema = new Schema({
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      enabled: { type: Boolean, default: true },
      joined: { type: Date, default: Date.now },
      // Security
      role: { type: String, required: true, default: UserRole.default },
      password: { type: String, required: true },
      refreshToken: String,
      passwordReset: { token: { type: String }, expires: { type: Date } },
    });

    this._model = model<IUser>('User', schema);
  }

  public get model(): Model<IUser> {
    return this._model;
  }
}