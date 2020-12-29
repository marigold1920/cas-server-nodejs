const express = require("express");

const { 
    getAllDriversAndPaging,
    getDriverDetails,
    registerAmbulance,
    updateAmbulance,
    grantDriverPermission
} = require("../services/driver.service");

const router = express.Router();

router.get('/admin/drivers', getAllDriversAndPaging);
router.get('/admin/drivers/details/:driverId', getDriverDetails);
router.post('/driver/:driverId/ambulances', registerAmbulance);
router.put('/driver/:driverId/ambulances', updateAmbulance);
router.get('/admin/drivers/:driverId', grantDriverPermission);

module.exports = router;