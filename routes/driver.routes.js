const { Router } = require("express");
const { register, login } = require("../app/controller/driver.controller");
const { verifyManager } = require("../app/middleware/manager.middleware");
const router = Router();

router.post("/register", verifyManager, register);
router.post("/login", login);

module.exports = router;
