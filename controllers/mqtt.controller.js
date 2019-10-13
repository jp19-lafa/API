

module.exports = {

  MqttController: class {

    constructor(services) {
      this.services = services;

      this.services.mqtt.authenticate = (client, username, password, callback) => {
        if (!client.id.match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
          callback(null, false);
        this.services.models.node.findOne({ macAddress: username, authorizationKey: password }).exec((error, node) => {
          if(!node || error)
            callback(null, false);
          else {
            this.services.logger.info(`Client ${client.id} authorized.`);
            callback(null, true);
          }
        });
      }

      this.services.mqtt.on('ready', () => {
        this.services.logger.info('MQTT Server Running');
      });

      this.services.mqtt.on('clientDisconnected', function (client) {
        this.services.logger.info(`Client ${client.id} disconnected.`);
        this.services.models.node.findOne({ macAddress: client.id }).exec((error, node) => {
          if(!node || error)
            return;
          
          node.status = false
          node.save();
        });
      });

      this.services.mqtt.on('clientConnected', function (client) {
        this.services.logger.info(`Client ${client.id} connected.`);
        this.services.models.node.findOne({ macAddress: client.id }).exec((error, node) => {
          if(!node || error)
            return;
          
          node.status = true
          node.save();
        });
      });

      this.services.mqtt.on('published', (packet, client) => {
        if(!packet.topic.split('/')[0].match(/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/))
          this.handleNodeMessage(packet, client);
      });
    }

    // Handle all node related messages 
    handleNodeMessage(packet, client) {

      switch (packet.topic.split('/')[1]) {
        case 'sensors':
            this.handleSensorMessage(packet, client);
          break;
        case 'actuators':
            this.handleActuatorMessage(packet, client);
          break;
      }
    }

    // Handle all node sensor related messages 
    handleSensorMessage(packet, client) {

    }

    // Handle all node actuator related messages 
    handleActuatorMessage(packet, client) {
      
    }
  }

}