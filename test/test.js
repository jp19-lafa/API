const request = require('supertest');
const app = require('../app');

describe('App', function() {
  it('Sends 401 on /',
     function(done) { request(app).get('/').expect(401, done); });
});
