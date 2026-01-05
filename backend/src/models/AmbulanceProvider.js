const mongoose = require("mongoose");

const AmbulanceProviderSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    location: {
      lat: Number,
      lng: Number
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AmbulanceProvider",
  AmbulanceProviderSchema
);
