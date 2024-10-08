const { Router } = require("express");
const {
  register,
  login,
  index,
  search,
} = require("../app/controller/driver.controller");
const { verifyManager } = require("../app/middleware/manager.middleware");
const router = Router();

router.post("/register", verifyManager, register);
router.post("/login", login);
router.get("/", verifyManager, index);
router.get("/search", verifyManager, search);

module.exports = router;
