const { Router } = require("express");
const router = Router();

const driver = require("./driver.routes");
const manager = require("./manager.routes");

router.use("/driver", driver);
router.use("/manager", manager);

module.exports = router;
