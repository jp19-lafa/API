import { Schema, model, Document, Model } from 'mongoose';
import { User } from './user.model';

declare interface IPasswordReset extends Document {
  user: User,
  passwordReset?: { token: string, expires: string }
}

export interface PasswordResetModel extends Model<IPasswordReset> { };

export class PasswordReset {

  private _model: Model<IPasswordReset>;

  constructor() {
    const schema = new Schema({
      user: {},
      passwordReset: { token: { type: String }, expires: { type: Date } },
    });

    this._model = model<IPasswordReset>('User', schema);
  }

  public get model(): Model<IPasswordReset> {
    return this._model;
  }
}