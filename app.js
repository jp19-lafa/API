const mosca = require("mosca");
const winston = require("winston");
const express = require("express");
const database = require("mongoose");
const cors = require("cors");
const jwt = require("express-jwt");
const app = express();
const fs = require("fs");
const { MqttController } = require("./controllers/mqtt.controller");
const { HttpController } = require("./controllers/http.controller");

const logger = winston.createLogger();

logger.add(new winston.transports.Console({ format: winston.format.simple() }));

const server = new mosca.Server({
  port: 1883,
  backend: {
    type: "mongo",
    url: "mongodb://database:27017/mqtt",
    pubsubCollection: "ascoltatori",
    mongo: {}
  }
});

// Mongoose Connection
database
  .connect("mongodb://database:27017/farmlab", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(
    () => logger.info("Database Connected"),
    err => {
      logger.error("Database Connection Error", err);
      process.exit(1);
    }
  );

// Define app wide services
let services = {
  database: database,
  mqtt: server,
  http: {},
  logger: logger,
  // models: { user: user, node: node },
  keys: {
    private: fs.readFileSync("keys/private.key"),
    public: fs.readFileSync("keys/public.key")
  },
  types: {
    actuators: ["lightint", "flowpump", "foodpump"],
    sensors: ["airtemp", "watertemp", "lightstr", "airhumidity", "waterph"]
  }
};

let mqttController = new MqttController(services);

let httpController = new HttpController(services);

module.exports = services;
