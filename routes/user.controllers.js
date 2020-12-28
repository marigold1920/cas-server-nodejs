const express = require("express");

const { registerRequester } = require("../services/user.services");

const router = express.Router();

router.route("/signup_requester").post(registerRequester);

module.exports = router;
