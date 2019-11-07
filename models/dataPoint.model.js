const mongoose = require("mongoose");

const dataPointSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('DataPoint', dataPointSchema);