import { Database } from '@database';
import { IUser, UserRole } from '@models/user.model';
import { get as config } from 'config';
import { hashSync, genSaltSync } from 'bcrypt';

export class DatabaseSeed {

  constructor() {
  }

  public async seed() {
    if (!await Database.Models.User.exists({ email: 'admin@farmlab.team' })) {
      console.log('Creating database seed');
      const user = await this.seedUser();
      console.log('Created user:', user);
    }
  }

  seedUser() {
    return new Promise<IUser>((resolve, reject) => {
      const user = new Database.Models.User({
        firstname: 'FarmLab',
        lastname: 'Administrator',
        email: config('admin.email'),
        password: hashSync(config('admin.password'), genSaltSync()),
        role: UserRole.admin
      });
      user.save().then(user => { resolve(user) }).catch(error => { reject(error) });
    });
  }


}