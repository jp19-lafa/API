import { BaseService } from "@modules/base.service";
import { Database } from "@database";
import { IUser } from '@models/user.model';

import bcrypt from 'bcrypt';
import uuidv4 from 'uuid/v4';
import config from 'config';
import { sign } from 'jsonwebtoken';

export class AuthService extends BaseService {

  constructor() {
    super();
  }

  public async getOneById(userid: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      Database.Models.User.findById({ id: userid, enabled: true }).exec((err, user) => {
        if(err) return reject(new Error('ServerError'));
        if(!user) return reject(new Error('NotFound'));
        return resolve(user);
      });
    });
  }

  public async authenticateByCredentials(creds: { email: string, password: string}): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      Database.Models.User.findOne({ email: creds.email })
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password))
          return resolve(user);
        return reject(new Error('NotFound'));
      })
      .catch(error => {
        return reject(new Error('ServerError'));
      });
    });
  }

  public async generateTokenSet(user: IUser): Promise<{ jwt: string, refresh: string }> {
    return new Promise<{ jwt: string, refresh: string }>((resolve, reject) => {
      const refreshToken = uuidv4();
      Database.Models.User.findByIdAndUpdate(
        user._id,
        { refreshToken: refreshToken },
        { new: true }
      ).exec((error, user) => {
        if (error) reject(error);

        resolve({
          jwt: this._generateJWT({
            subject: user._id,
            email: user.email
          }),
          refresh: user.refreshToken
        });
      });
    });
  }

  private _generateJWT(args: { subject: string, email: string }) {
    return sign(
      {
        aud: config.get('jwt.audience'),
        iss: config.get('jwt.issuer'),
        jti: uuidv4(),
        sub: args.subject,
        email: args.email
      },
      config.get('jwt.signingkey'),
      {
        expiresIn: config.get('jwt.expiresIn')
      }
    );
  }

}