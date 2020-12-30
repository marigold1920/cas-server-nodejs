const express = require("express");

const { 
    getConfiguration,
    updateSystemConfiguration
} = require("../services/system.service");

const router = express.Router();

router.get('/system/configurations', getConfiguration);
router.post('/admin/system/configurations', updateSystemConfiguration);

module.exports = router;