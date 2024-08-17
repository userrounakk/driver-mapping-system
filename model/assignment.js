const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "completed", "expired"],
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  rejectedBy: [{ type: Schema.Types.ObjectId, ref: "Driver" }],
  invite: {
    type: [Schema.Types.ObjectId],
    ref: "Driver",
    default: [],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
AssignmentSchema.index({ location: "2dsphere" });
const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;
