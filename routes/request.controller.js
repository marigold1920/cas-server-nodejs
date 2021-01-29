const express = require("express");
const authorize = require("../middlewares/authorize");
const {
    saveRequest,
    acceptRequest,
    history,
    driverHistory,
    getAllRequestsAndPaging,
    getRequestDetails,
    getRequests,
    getInfoDriver,
    finishRequest,
    pickUpPatient,
    cancelRequestRequester,
    cancelRequestDriver,
    rejectRequest,
    feedbackRequest,
    rejectedRequest
} = require("../services/request.service");

const router = express.Router();

router.post("/requester/requests/:userId", authorize([1]), saveRequest);
router.get("/requester/requests/:requestId", getInfoDriver);
router.get("/requester/:userId/requests/history", authorize([1]), history);
router.put("/requester/requests/:requestId", authorize([1]), feedbackRequest);
router.put("/requester/requests/cancel/:requestId", cancelRequestRequester);
router.put("/requester/requests/rejected/:requestId", rejectedRequest);
router.put("/driver/:driverId/requests", authorize([2]), acceptRequest);
router.get("/driver/:userId/requests/history", authorize([2]), driverHistory);
router.get("/driver/requests", authorize([2]), getRequests);
router.put("/driver/requests/reject", rejectRequest);
router.put("/driver/requests/finish/:requestId", finishRequest);
router.put("/driver/requests/pickup/:requestId", pickUpPatient);
router.put("/driver/requests/cancel/:driverId", cancelRequestDriver);
router.get("/admin/requests", getAllRequestsAndPaging);
router.get("/admin/requests/details/:requestId", getRequestDetails);

module.exports = router;
