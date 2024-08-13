const jwt = require("jsonwebtoken");
const Driver = require("../../model/driver");
const verifyDriver = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized access" });
  jwt.verify(token, process.env.ENCRYPTION_CODE, async (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });

    const driver = await Driver.findById({ _id: decoded.id });
    if (!driver)
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });

    req.driverId = decoded.id;
    next();
  });
};

module.exports = { verifyDriver };
