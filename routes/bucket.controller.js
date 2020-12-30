const express = require("express");

const { updateProfile } = require("../services/amazon.client");

const router = express.Router();

router.put('/update-profile-image/:userId', updateProfile);

module.exports = router;