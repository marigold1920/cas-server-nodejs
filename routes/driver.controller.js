const express = require("express");
const authorize = require("../middlewares/authorize");

const {
    getAllDriversAndPaging,
    getDriverDetails,
    registerAmbulance,
    updateAmbulance,
    grantDriverPermission,
    unregisterAmbulance
} = require("../services/driver.service");

const router = express.Router();

router.get("/admin/drivers", getAllDriversAndPaging);
router.get("/admin/drivers/details/:driverId", getDriverDetails);
router.post("/driver/:driverId/ambulances", authorize([2]), registerAmbulance);
router.put("/driver/:driverId/ambulances", authorize([2]), updateAmbulance);
router.get("/admin/drivers/:driverId", grantDriverPermission);
router.put("/driver/ambulances/:ambulanceId/cancel", unregisterAmbulance);

module.exports = router;
