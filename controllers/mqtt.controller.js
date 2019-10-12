

module.exports = {

  MqttController: class {

    constructor(service) {
      this.service = service;

      this.service.mqtt.authenticate = (client, username, password, callback) => {
        this.service.models.node.findOne({ macAddress: username, authorizationKey: password }).exec((error, node) => {
          if(!node || error)
            callback(null, false);
          else
            callback(null, true);
        });
      }

      this.service.mqtt.on('ready', () => {
        this.service.logger.info('MQTT Server Running');
      });

      this.service.mqtt.on('clientDisconnected', function (client) {
        // TODO: Set node to offline
      });

      this.service.mqtt.on('published', (packet, client) => {
        this.messageHandler(packet, client);
      });
    }

    messageHandler(packet, client) {
      // TODO: Talk to Tom about formatting & topics
    }
  }

}