module.exports = {
  MqttController : class {
    constructor(services) {
      this.services = services;

      services.mqtt.authenticate = (client, username, password, callback) => {
        if (!client.id.match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
          callback(null, false);
        services.models.node
            .findOne({macAddress : username, authorizationKey : password})
            .exec((error, node) => {
              if (!node || error) {
                callback(null, false);
                services.logger.info(`Client ${client.id} unauthorized.`);
              } else {
                services.logger.info(`Client ${client.id} authorized.`);
                callback(null, true);
              }
            });
      };

      services.mqtt.on("ready",
                       () => { services.logger.info("MQTT Server Running"); });

      services.mqtt.on("clientDisconnected", function(client) {
        services.logger.info(`Client ${client.id} disconnected.`);
        services.models.node.findOne({macAddress : client.id})
            .exec((error, node) => {
              if (!node || error)
                return;

              node.status = false;
              node.save();
            });
      });

      services.mqtt.on("clientConnected", function(client) {
        services.logger.info(`Client ${client.id} connected.`);
        services.models.node.findOne({macAddress : client.id})
            .exec((error, node) => {
              if (!node || error)
                return;

              node.status = true;
              node.save();
            });
      });

      services.mqtt.on("published", (packet, client) => {
        if (packet.topic.split("/")[0].match(
                /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
          this.handleNodeMessage(packet, client);
      });
    }

    // Handle all node related messages
    handleNodeMessage(packet, client) {
      switch (packet.topic.split("/")[1]) {
      case "sensors":
        this.handleSensorMessage(packet, client);
        break;
      case "actuators":
        this.handleActuatorMessage(packet, client);
        break;
      }
    }

    // Handle all node sensor related messages
    handleSensorMessage(packet, client) {
      this.services.logger.info(
          `Received: [SENSOR] ${packet.payload.toString()} for ${
              packet.topic.split("/")[2]} on ${client.id}`);
    }

    // Handle all node actuator related messages
    handleActuatorMessage(packet, client) {}
  }
};
