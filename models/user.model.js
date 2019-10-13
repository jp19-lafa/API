const mongoose = require("mongoose");

module.exports = {
  userSchema: new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    refreshToken: String,
    passwordReset: {
      token: { type: String },
      expires: { type: Date }
    },
    joined: { type: Date, default: Date.now }
  })
};
