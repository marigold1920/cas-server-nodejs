const express = require("express");

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
router.route("/driver/:driverId/ambulances").post(registerAmbulance).put(updateAmbulance);
router.get("/admin/drivers/:driverId", grantDriverPermission);
router.put("/driver/ambulances/:ambulanceId/cancel", unregisterAmbulance);

module.exports = router;
