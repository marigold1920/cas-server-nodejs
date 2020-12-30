const express = require("express");
const router = express.Router();
const {getRequesters, getRequesterDetails, updateHealthInformation, grantRequesterPermission} = require('../services/requester.service');

router.get('/admin/requesters', getRequesters);
router.get('/admin/requesters/details/:requesterId', getRequesterDetails);
router.put('/requesters/:userId/health_information', updateHealthInformation);
router.get('/admin/requesters/:requesterId', grantRequesterPermission);

module.exports = router;

