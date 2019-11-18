import { connect, connection, Connection } from 'mongoose';
import { UserModel, User } from './models/user.model';
import config from 'config';

declare interface IModels {
  User: UserModel;
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
      User: new User().model
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