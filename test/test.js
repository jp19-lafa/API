const request = require('supertest');
const app = require('../app');

describe('App', function() {
  it('Sends 404 on /', function(done) {
    request(app)
      .get('/')
      .expect(404, done);
  });
}); 
