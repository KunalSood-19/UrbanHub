// models/Theatre.js
const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  city:    { type: String, required: true, trim: true },
  address: { type: String, required: true },
  screens: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("Theatre", theatreSchema);