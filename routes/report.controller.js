const express = require("express");

const { getReport } = require("../services/report.service");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.get("/admin/reports", authorize([3]), getReport);

module.exports = router;
