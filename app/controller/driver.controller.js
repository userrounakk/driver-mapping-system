const Driver = require("../../model/driver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    return res.status(200).json({ status: "success", token });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

const register = async (req, res) => {
  try {
    let { name, email, phone, password, preferredLocation } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    preferredLocation = preferredLocation ?? null;
    const driverId = `${Math.random().toString(36).substring(2, 5)}${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;
    const driver = new Driver({
      driverId,
      name,
      email,
      phone,
      password: hashedPassword,
      preferredLocation,
    });
    await driver.save();
    return res
      .status(200)
      .json({ status: "success", message: "Driver registered successfully" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

module.exports = { login, register };
