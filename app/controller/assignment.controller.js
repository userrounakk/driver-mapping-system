const Assignment = require("../../model/assignment");
const Driver = require("../../model/driver");
const Vehicle = require("../../model/vehicle");

const create = async (req, res) => {
  try {
    const { vehicle, location, startTime, endTime } = req.body;
    const managerId = req.managerId;
    let driverId = req.body.driverId;

    const assignment = new Assignment({
      managerId,
      vehicle,
      location,
      startTime,
      endTime,
      invite: driverId ? driverId : [],
    });
    await assignment.save();
    return res
      .status(200)
      .json({ status: "success", message: "Assignment created" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const search = async (req, res) => {
  try {
    const { model } = req.query;

    const vehicles = await Vehicle.find({
      model: { $regex: model, $options: "i" },
    });
    return res.status(200).json({ status: "success", vehicles });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const getDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.body;

    const drivers = await Driver.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 1000 * radius,
          spherical: true,
        },
      },
    ]);
    return res.status(200).json({ status: "success", drivers });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const myAssignment = async (req, res) => {
  const id = req.driverId;
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  try {
    const assignments = await Assignment.find({
      invite: { $in: [id] },
      status: "pending",
      rejectedBy: { $nin: [id] },
    })
      .populate("vehicle", "model")
      .populate("managerId", "name")
      .skip(skip)
      .limit(limit)
      .exec();

    const totalAssignments = await Assignment.countDocuments({
      $or: [{ driverId: id }, { driverId: null }],
      status: "pending",
      rejectedBy: { $nin: [id] },
    });

    return res.status(200).json({
      status: "success",
      assignments,
      totalPages: Math.ceil(totalAssignments / limit),
      currentPage: page,
    });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const assign = async (req, res) => {
  try {
    const id = req.params.id;
    const driverId = req.driverId;
    const assignment = await Assignment.findOne({ _id: id });
    const currentTime = new Date();
    if (currentTime > assignment.startTime) {
      assignment.status = "expired";
      await assignment.save();
      return res
        .status(400)
        .json({ status: "error", message: "Assignment expired" });
    }
    const vehicle = assignment.vehicle;
    if (!assignment)
      return res
        .status(400)
        .json({ status: "error", message: "Assignment not found" });
    if (assignment.status !== "pending") {
      return res
        .status(400)
        .json({ status: "error", message: "Assignment is already taken" });
    }
    if (assignment.driveId && assignment.driverId !== driverId) {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to take this assignment.",
      });
    }
    const driver = await Driver.findOne({ _id: driverId });
    if (!driver)
      return res
        .status(400)
        .json({ status: "error", message: "Driver not found" });
    // const assignments = await Assignment.find({
    //   driverId,
    //   status: "accepted",
    //   $or: [
    //     {
    //       $and: [
    //         { startTime: { $lte: assignment.startTime } },
    //         { endTime: { $gte: assignment.startTime } },
    //       ],
    //     },
    //     {
    //       $and: [
    //         { startTime: { $lte: assignment.endTime } },
    //         { endTime: { $gte: assignment.endTime } },
    //       ],
    //     },
    //     {
    //       $and: [
    //         { startTime: { $gte: assignment.startTime } },
    //         { endTime: { $lte: assignment.endTime } },
    //       ],
    //     },
    //   ],
    // });
    const assignments = await Assignment.find({
      status: "accepted",
      $or: [
        {
          vehicle,
          $or: [
            {
              $and: [
                { startTime: { $lte: assignment.startTime } },
                { endTime: { $gte: assignment.startTime } },
              ],
            },
            {
              $and: [
                { startTime: { $lte: assignment.endTime } },
                { endTime: { $gte: assignment.endTime } },
              ],
            },
            {
              $and: [
                { startTime: { $gte: assignment.startTime } },
                { endTime: { $lte: assignment.endTime } },
              ],
            },
          ],
        },
        {
          driverId,
          $or: [
            {
              $and: [
                { startTime: { $lte: assignment.startTime } },
                { endTime: { $gte: assignment.startTime } },
              ],
            },
            {
              $and: [
                { startTime: { $lte: assignment.endTime } },
                { endTime: { $gte: assignment.endTime } },
              ],
            },
            {
              $and: [
                { startTime: { $gte: assignment.startTime } },
                { endTime: { $lte: assignment.endTime } },
              ],
            },
          ],
        },
      ],
    });
    if (assignments.length)
      return res.status(400).json({
        status: "error",
        message:
          "The vehicle is busy or you have an assignment at the same time",
      });
    assignment.driverId = driverId;
    assignment.status = "accepted";
    await assignment.save();
    return res
      .status(200)
      .json({ status: "success", message: "Assignment accepted" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const reject = async (req, res) => {
  try {
    const id = req.params.id;
    const driverId = req.driverId;
    const assignment = await Assignment.findOne({ _id: id });
    if (!assignment)
      return res
        .status(400)
        .json({ status: "error", message: "Assignment not found" });
    if (assignment.status !== "pending")
      return res
        .status(400)
        .json({ status: "error", message: "Assignment is already taken" });
    if (assignment.driverId && assignment.driverId !== driverId)
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to reject this assignment",
      });
    assignment.rejectedBy.push(driverId);
    await assignment.save();
    return res
      .status(200)
      .json({ status: "success", message: "Assignment rejected" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

module.exports = { create, search, myAssignment, assign, reject, getDrivers };
