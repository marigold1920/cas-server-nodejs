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
} = require("../services/request.service");

const router = express.Router();

router.route("/requester/requests/:userId").post(saveRequest);
router.get("/requester/requests/:requestId", getInfoDriver);
router.put("/requester/requests/:requestId", feedbackRequest);
router.put("/requester/requests/cancel/:requestId", cancelRequest);
router.put("/driver/:driverId/requests/:requestId", acceptRequest);
router.get("/driver/history/details/:requestId", driverHistoryDetails);
router.get("/driver/:userId/requests/history", driverHistory);
router.get("/driver/requests/:requestId", getRequestById);
router.put("/driver/requests/finish/:requestId", finishRequest);
router.put("/driver/requests/pickup/:requestId", pickUpPatient);
router.put("/driver/requests/cancel", rejectRequest);
router.get("/admin/requests", getAllRequestsAndPaging);
router.get("/admin/requests/details/:requestId", getRequestDetails);
router.get("/requests/history/:userId", history);
router.get("/requests/history/details/:requestId", historyDetails);

module.exports = router;
