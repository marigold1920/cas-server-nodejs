const express = require("express");

const userService = require("../services/user.services");

const router = express.Router();

router.post('/signup_requester', registerRequester);

// router.route("/signup_requester").post(registerRequester);

module.exports = router;

function registerRequester(req, res, next) {
    userService.signupRequester(req.body)
        .then(user => res.json(user))
        .catch(next);
}
