const express = require("express");

const {
    findAllAmbulancesAndPaging,
    getAmbulanceDetails,
    findAmbulance,
    grantAmbulancePermission,
    acceptRegistedAmbulance,
    rejectRegistedAmbulance,
    checkIsRegistered
} = require("../services/ambulance.service");

const router = express.Router();

router.get("/admin/ambulances", findAllAmbulancesAndPaging);
router.get("/admin/ambulances/details/:ambulanceId", getAmbulanceDetails);
router.get("/driver/:driverId/ambulances", findAmbulance);
router.get("/admin/ambulances/:ambulanceId", grantAmbulancePermission);
router.get("/admin/ambulances/accept/:ambulanceId", acceptRegistedAmbulance);
router.post("/admin/ambulances/reject/:ambulanceId", rejectRegistedAmbulance);
router.get("/driver/ambulances/:licensePlate", checkIsRegistered);

module.exports = router;
