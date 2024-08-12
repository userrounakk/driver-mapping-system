const mongoose = require("mongoose");
const { Schema } = mongoose;

const DriverSchema = new Schema({
  driverId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferredLocation: {
    type: String,
  },
});

const Driver = mongoose.model("Driver", DriverSchema);
module.exports = Driver;
