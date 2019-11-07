const request = require('supertest');
const app = require('../app').http;

describe('Authentication routes', () => {

  let tokenSet = {};

  before(next => {
    // FIXME: Make dynamic
    setTimeout(() => {
      next();
    }, 1000);
  });

  it('Should be able create a new user');

  it('Should be able to login with the new user', done => {
    request(app)
      .post('/auth/login')
      .send({ email: 'admin@farmlab.team', password: 'IAmAdministrator' })
      .set('Accept', 'application/json')
      .expect((res) => {
        if (!('jwt' in res.body)) throw new Error("Missing web token");
        if (!('refresh' in res.body)) throw new Error("Missing refresh token");
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        tokenSet = res.body;
        done();
      });
  });

  it('Should be able to refresh a login session', done => {
    request(app)
      .post('/auth/refresh')
      .send({ token: tokenSet.refresh })
      .set('Accept', 'application/json')
      .expect((res) => {
        if (!('jwt' in res.body)) throw new Error("Missing web token");
        if (!('refresh' in res.body)) throw new Error("Missing refresh token");
      })
      .expect(200).end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('Should not be able to refresh twice with the same token', done => {
    request(app)
      .post('/auth/refresh')
      .send({ token: tokenSet.refresh })
      .set('Accept', 'application/json')
      .expect(403).end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

}); 
