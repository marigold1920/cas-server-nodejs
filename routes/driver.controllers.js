const express = require("express");

const {
    getAllDriversAndPaging,
    getDriverDetails,
    registerAmbulance
} = require("../services/driver.services");

const router = express.Router();

router.get("/admin/drivers", getAllDriversAndPaging);
router.get("/admin/drivers/details/:driverId", getDriverDetails);
router.route("/driver/:driverId/ambulances").post(registerAmbulance);

module.exports = router;
