const { Router } = require("express");
const router = Router();

const driver = require("./driver.routes");
const manager = require("./manager.routes");
const assignment = require("./assignment.routes");

router.use("/driver", driver);
router.use("/manager", manager);
router.use("/assignment", assignment);

module.exports = router;
