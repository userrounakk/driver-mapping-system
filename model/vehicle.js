const mongoose = require("mongoose");
const { Schema } = mongoose;

const VehicleSchema = new Schema({
  model: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "available",
    enum: ["available", "occupied"],
  },
  occupiedBy: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;
