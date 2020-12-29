const express = require("express");

const { 
    getReport
} = require("../services/report.service");

const router = express.Router();

router.get('/api/admin/reports', getReport);

module.exports = router;