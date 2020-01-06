import { BaseService } from '@modules/base.service';
import { Database } from '@database';
import { IUser } from '@models/user.model';

export class UsersService extends BaseService {

  constructor() {
    super();
  }

  public getAllUsers(): Promise<IUser[]> {
    return new Promise<IUser[]>((resolve, reject) => {
      Database.Models.User.find({}).select('_id firstname lastname email role').exec((err, users) => {
        if(err) return reject(err);
        return resolve(users);
      });
    });
  }

  public getCurrentUser(sub: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      Database.Models.User.findById(sub).select('_id firstname lastname email role').exec((err, user) => {
        if(err || !user) return reject(err);
        return resolve(user);
      });
    });
  }
}