const jwt = require("jsonwebtoken");
const Manager = require("../../model/manager");
const verifyManager = (req, res, next) => {
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

    const manager = await Manager.findById({ _id: decoded.id });
    if (!manager)
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized access" });

    req.managerId = decoded.id;
    next();
  });
};

module.exports = { verifyManager };
