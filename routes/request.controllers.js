const express = require("express");
const { 
    saveRequest, 
    acceptRequest, 
    history,
    historyDetails,
    driverHistoryDetails,
    driverHistory,
    getAllRequestsAndPaging,
    getRequestDetails,
    getRequestById,
    getInfoDriver,
    finishRequest,
    pickUpPatient,
    cancelRequest,
    rejectRequest,
    feedbackRequest
} = require("../services/request.services");

const router = express.Router();

router.route("/requester/:userId/requests").post(saveRequest);
router.route("/driver/:driverId/requests/:requestId").put(acceptRequest);
router.get('/requests/history/:userId', history);
router.get('/requests/history/details/:historyId', historyDetails);
router.get('/driver/history/details/:historyId', driverHistoryDetails);
router.get('/driver/:driverId/requests/history', driverHistory);
router.get('/admin/requests', getAllRequestsAndPaging);
router.get('/admin/requests/details/:requestId', getRequestDetails);
router.get('/driver/requests/:requestId', getRequestById);
router.get('/requester/requests/:requestId', getInfoDriver);
router.put('/driver/requests/finish/:requestId', finishRequest);
router.put('/driver/requests/pickup/:requestId', pickUpPatient);
//Co 2 truong hop cancel chua biet viet
router.get('', cancelRequest);
router.put('/requester/requests/rejected/:requestId', rejectRequest);
router.put('/requester/requests/:requestId', feedbackRequest);

module.exports = router;
