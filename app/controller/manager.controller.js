const Manager = require("../../model/manager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    const valid = await bcrypt.compare(password, manager.password);
    if (!valid)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid password" });
    const token = jwt.sign({ id: manager._id }, process.env.ENCRYPTION_CODE);
    return res.status(200).json({ status: "success", token });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const manager = new Manager({
      name,
      email,
      password: hashedPassword,
    });
    await manager.save();
    return res
      .status(200)
      .json({ status: "success", message: "Manager registered successfully" });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
};

module.exports = { login, register };
