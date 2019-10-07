const mosca = require('mosca');
const winston = require('winston');
const express = require('express');
const app = express();

const logger = winston.createLogger();

logger.add(new winston.transports.Console({
  format: winston.format.simple()
}));

const server = new mosca.Server({
  port: 1887,
  backend: {
    type: 'mongo',
    url: 'mongodb://database:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
  }
});

server.authenticate = (client, username, password, callback) => {
  if (username.toString() === 'Farm' && password.toString() === 'Lab') {
    callback(null, true);
  }
  callback(null, false);
}

server.on('ready', () => {
  //
});

server.on('clientDisconnected', function (client) {
  //
});

server.on('published', (packet, client) => {
  //
});

app.listen(8080, '0.0.0.0', () => {
  logger.info('HTTP Server Running');
});

module.exports = app;