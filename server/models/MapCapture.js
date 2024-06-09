const mongoose = require("mongoose");

const mapCaptureSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Map Capture" },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  zoom: { type: Number, required: true },
  width: { type: Number, required: true, default: 600 },
  height: { type: Number, required: true, default: 400 },
});

const MapCapture = mongoose.model("MapCapture", mapCaptureSchema);

module.exports = MapCapture;
