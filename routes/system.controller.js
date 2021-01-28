const express = require("express");

const {
    getConfiguration,
    updateSystemConfiguration,
    getConfig
} = require("../services/system.service");

const router = express.Router();

router.get("/system/configurations", getConfiguration);
router.post("/admin/system/configurations", updateSystemConfiguration);
router.get("/system/test", getConfig);

module.exports = router;
