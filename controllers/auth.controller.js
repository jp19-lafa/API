const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");
const jwt = require("jsonwebtoken");

const User = require('../models/user.model');
const Node = require('../models/node.model');

const hashRounds = process.env.HASH_ROUNDS || 12;

module.exports = {
  AuthController: class {
    constructor(services) {
      this.services = services;
      User
        .findOne({ email: "admin@farmlab.team" })
        .exec((error, user) => {
          if (!user) {
            user = new User({
              firstname: "Administrator",
              lastname: "Global",
              email: "admin@farmlab.team",
              password: bcrypt.hashSync("IAmAdministrator", hashRounds)
            });
            user.save().then(result => {
              services.logger.info("Created Global Admin");
              let node = new Node({
                label: 'Development Node Alfa',
                macAddress: 'AA:AA:AA:AA:AA:AA',
                authorizationKey: '813aec9f-a491-41d1-88b2-ebb5d574fce4',
                allowPublicStats: true,
                members: [user]
              }).save();
            });
          }
        });
    }

    refreshTokenSet(sub, refreshToken) {}

    async authenticateUserByCredentials(email, password) {
      return new Promise((resolve, reject) => {
        User
          .findOne({ email: email })
          .then(user => {
            if (user && bcrypt.compareSync(password, user.password))
              resolve(user);
            resolve(null);
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    async authenticateUserByRefreshToken(token) {
      return new Promise((resolve, reject) => {
        User
          .findOne({ refreshToken: token })
          .then(user => {
            resolve(user);
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    async generateTokenSet(user) {
      return new Promise((resolve, reject) => {
        const refreshToken = uuidv4();
        User
          .findByIdAndUpdate(
            user._id,
            { refreshToken: refreshToken },
            { new: true }
          )
          .exec((error, user) => {
            if (error) reject(error);

            resolve({
              jwt: this._generateJWT(user._id),
              refresh: user.refreshToken
            });
          });
      });
    }

    _generateJWT(sub, options = {}) {
      return jwt.sign(
        { audience: "aud:*", issuer: "FarmLabTeam", sub: sub },
        this.services.keys.private,
        { expiresIn: "24h" }
      );
    }
  }
};
