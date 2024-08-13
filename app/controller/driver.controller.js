const Driver = require("../../model/driver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 100;
    const totalPages = Math.ceil((await Driver.countDocuments()) / limit);
    const drivers = await Driver.find({}, { password: 0 })
      .limit(limit)
      .skip((page - 1) * limit);
    return res.status(200).json({ status: "success", drivers, totalPages });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (!driver)
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    const valid = await bcrypt.compare(password, driver.password);
    if (!valid)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid password" });
    const token = jwt.sign({ id: driver._id }, process.env.ENCRYPTION_CODE);
    return res.status(200).json({
      status: "success",
      token,
      details: {
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
      },
    });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const driverId = `${Math.random().toString(36).substring(2, 5)}${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;
    const driver = new Driver({
      driverId,
      name,
      email,
      phone,
      password: hashedPassword,
      location,
    });
    await driver.save();
    return res
      .status(200)
      .json({ status: "success", message: "Driver registered successfully" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};
const search = async (req, res) => {
  const type = req.query.type || "name";
  if (type == "name") {
    try {
      const { name } = req.query;
      const drivers = await Driver.find({
        name: { $regex: name, $options: "i" },
      });
      return res.status(200).json({ status: "success", drivers });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  } else if (type == "phone") {
    try {
      const { phone } = req.query;
      const drivers = await Driver.find({
        phone: { $regex: phone, $options: "i" },
      });
      return res.status(200).json({ status: "success", drivers });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  }
};
module.exports = { login, register, index, search };
