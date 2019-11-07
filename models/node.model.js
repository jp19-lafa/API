const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  label: String,
  macAddress: { type: String, required: true },
  authorizationKey: { type: String, required: true },
  status: { type: Boolean, default: false, required: true },
  liveSince: { type: Date, default: Date.now },
  allowPublicStats: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  sensors: {
    airtemp: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    watertemp: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    lightstr: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    airhumidity: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    waterph: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    }
  },
  actuators: {
    lightint: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    flowpump: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    },
    foodpump: {
      value: { type: Number, default: -1 },
      timestamp: { type: Date, default: Date.now },
      history: [{ type: mongoose.Schema.ObjectId, ref: "DataPoint" }]
    }
  },
  actions: [{ type: mongoose.Schema.ObjectId, ref: "Actions" }]
});

module.exports = mongoose.model('Node', nodeSchema);