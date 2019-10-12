const mongoose = require('mongoose');

module.exports = {
  nodeSchema: new mongoose.Schema({
    label: String,
    macAddress: { type: String, required: true },
    authorizationKey: { type: String, required: true },
    status: { type: String, default: 0, required: true },
    liveSince: { type: Date, default: Date.now },
    allowPublicStats: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    sensors: [{ type: mongoose.Schema.ObjectId, ref: 'Sensor' }],
    actuators: [{ type: mongoose.Schema.ObjectId, ref: 'Actuator' }],
    actions: [{ type: mongoose.Schema.ObjectId, ref: 'Actions' }]
  })
}
