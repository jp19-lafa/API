const bcrypt = require('bcrypt');
// const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');

const hashRounds = process.env.HASH_ROUNDS || 12;

module.exports = {

  AuthController: class {

    constructor(services) {
      this.services = services;
      services.models.user.findOne({ email: 'admin@farmlab.team' }).exec((error, user) => {
        if(!user) {
          user = new services.models.user({
            firstname: 'Administrator',
            lastname: 'Global',
            email: 'admin@farmlab.team',
            password: bcrypt.hashSync('IAmAdministrator', hashRounds)
          });
          user.save().then(result => {
            services.logger.info('Created Global Admin');
          })
        }
      })
    }

    refreshTokenSet(sub, refreshToken) {
      
    }

    async authenticateUser(email, password) {
      return new Promise((resolve, reject) => {
        this.services.models.user.findOne({ email: email }).then(user => {
          if (bcrypt.compareSync(password, user.password))
            resolve(user);
          resolve(null);
        }).catch(error => {
          reject(error);
        })
      });
    }

    async generateTokenSet(user) {
      return {
        jwt: this._generateJWT(user._id),
        refresh: '123-123-123-123'
      }
    }

    _generateJWT(sub, options = {}) {
      return jwt.sign({
        audience: "aud:*",
        issuer: "FarmLabTeam",
        sub: sub
      },
      this.services.keys.private,
      {
        expiresIn: "24h"
      });
    }

    

  }

}