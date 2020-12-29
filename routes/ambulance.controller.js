const express = require("express");

const { 
    findAllAmbulancesAndPaging, 
    getAmbulanceDetails,
    findAmbulance,
    grantAmbulancePermission,
    acceptRegisterAmbulance,
    rejectRegisteAmbulance
} = require("../services/ambulance.service");

const router = express.Router();

router.get('/admin/ambulances', findAllAmbulancesAndPaging);
router.get('/admin/ambulances/details/:ambulanceId', getAmbulanceDetails);
router.get('/driver/:driverId/ambulances', findAmbulance);
router.get('/admin/ambulances/:ambulanceId', grantAmbulancePermission);
router.get('/admin/ambulances/accept/:ambulanceId', acceptRegisterAmbulance);
router.post('/admin/ambulances/reject/:ambulanceId', rejectRegisteAmbulance);

module.exports = router;