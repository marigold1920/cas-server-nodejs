const express = require("express");

const { signupRequester } = require("../services/user.service");

const router = express.Router();

router.post("/signup_requester", signupRequester);

module.exports = router;
