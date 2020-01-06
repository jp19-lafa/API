declare namespace NodeJS {
  interface Global {
    services: {
      authService: import('../../modules/auth/auth.service').AuthService,
      nodesService: import('../../modules/nodes/nodes.service').NodesService,
      sensorsService: import('../../modules/sensors/sensors.service').SensorsService,
      actuatorsService: import('../../modules/actuators/actuators.service').ActuatorsService,
      mqttService: import('../../modules/mqtt/mqtt.service').MqttService,
      usersService: import('../../modules/users/users.service').UsersService,
    }
  }
}
