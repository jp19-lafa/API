const request = require('supertest');
const app = require('../app');

describe('Node routes', () => {

  let jwt, testNode;

  before(next => {
    request(app)
      .post('/auth/login')
      .send({ email: 'admin@farmlab.team', password: 'IAmAdministrator' })
      .end(function(err, res) {
        if (err) return next(err);
        jwt = res.body.jwt;
        next();
      });
  });

  it('Should be able to view my nodes with auth', done => {
    request(app)
      .get('/nodes')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        testNode = res.body[0];
        done();
      });
  });
}); 
