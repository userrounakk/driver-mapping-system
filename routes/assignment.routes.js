const { Router } = require("express");
const { verifyManager } = require("../app/middleware/manager.middleware");
const { verifyDriver } = require("../app/middleware/driver.middleware");
const {
  create,
  search,
  myAssignment,
  reject,
  assign,
  getDrivers,
} = require("../app/controller/assignment.controller");
const router = Router();

router.post("/create", verifyManager, create);
router.get("/search", verifyManager, search);
router.post("/drivers", verifyManager, getDrivers);
router.get("/driver/list", verifyDriver, myAssignment);
router.put("/assign/:id", verifyDriver, assign);
router.put("/reject/:id", verifyDriver, reject);
module.exports = router;
