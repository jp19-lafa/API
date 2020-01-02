import { BaseService } from "@modules/base.service";
import { Database } from "@database";
import { IUser } from '@models/user.model';

import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import uuidv4 from 'uuid/v4';
import config from 'config';
import { sign } from 'jsonwebtoken';
import { readFileSync } from "fs";

export class AuthService extends BaseService {

  protected privateKey: Buffer;

  constructor() {
    super();
    this.privateKey = readFileSync('keys/private.key');
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
        if (user && compareSync(creds.password, user.password))
          return resolve(user);
        return reject(new Error('NotFound'));
      })
      .catch(error => {
        return reject(new Error('ServerError'));
      });
    });
  }

  public async authenticateUserByRefreshToken(token: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      Database.Models.User.findOne({ refreshToken: token })
        .then(user => {
          if (!user) return reject(new Error('InvalidToken'));
          resolve(user);
        })
        .catch(error => {
          reject(new Error('ServerError'));
        });
    });
  }

  public async generateTokenSet(user: IUser): Promise<{ jwt: string, refresh: string }> {
    return new Promise<{ jwt: string, refresh: string }>(async (resolve, reject) => {
      const refreshToken = await this.updateUserRefreshToken(user);
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

  public async registerUser(firstname: string, lastname: string, email: string, password: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      if(!firstname || !lastname || !email || !password) return reject('Invalid value received');
      const user: IUser = new Database.Models.User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashSync(password, genSaltSync())
      });
      user.save((error, user) => {
        if (error) return reject(error);
        return resolve(user);
      })
    });
  }

  protected _generateJWT(args: { subject: string, email: string }) {
    return sign(
      {
        aud: config.get('jwt.audience'),
        iss: config.get('jwt.issuer'),
        jti: uuidv4(),
        sub: args.subject,
        email: args.email
      },
      this.privateKey,
      {
        expiresIn: config.get('jwt.expiresIn')
      }
    );
  }

  protected updateUserRefreshToken(user: IUser): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if(!user._id) return reject();
      const token = uuidv4();
      Database.Models.User.findByIdAndUpdate(user._id, { refreshToken: token }).exec((error, user) => {
        if(!user || error) return reject();
        return resolve(token);
      })
    });
  }

}