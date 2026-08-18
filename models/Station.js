const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    line: { type: String, required: true, trim: true }, // e.g. "Red", "Blue"
    order: { type: Number, required: true }, // position along the line
    code: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Station', stationSchema);
