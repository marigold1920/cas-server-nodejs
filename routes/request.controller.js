const express = require("express");
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
    feedbackRequest
} = require("../services/request.service");

const router = express.Router();

router.route("/requester/requests/:userId").post(saveRequest);
router.get("/requester/requests/:requestId", getInfoDriver);
router.get("/requester/:userId/requests/history", history);
router.put("/requester/requests/:requestId", feedbackRequest);
router.put("/requester/requests/cancel/:requestId", cancelRequestRequester);
router.put("/driver/:driverId/requests", acceptRequest);
router.get("/driver/:userId/requests/history", driverHistory);
router.get("/driver/requests", getRequests);
router.put("/driver/requests/reject", rejectRequest);
router.put("/driver/requests/finish/:requestId", finishRequest);
router.put("/driver/requests/pickup/:requestId", pickUpPatient);
router.put("/driver/requests/cancel", cancelRequestDriver);
router.get("/admin/requests", getAllRequestsAndPaging);
router.get("/admin/requests/details/:requestId", getRequestDetails);

module.exports = router;
