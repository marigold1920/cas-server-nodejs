const express = require("express");
const { saveRequest, acceptRequest } = require("../services/request.services");

const router = express.Router();

router.route("/requester/:userId/requests").post(saveRequest);
router.route("/driver/:driverId/requests/:requestId").put(acceptRequest);

module.exports = router;
