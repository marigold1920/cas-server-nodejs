const asyncHandler = require("../middlewares/asyncHandler");
const Request = require("../models/Request");
const RequestStatus = require("../models/RequestStatus");
const User = require("../models/User");

exports.saveRequest = asyncHandler(async (request, response) => {
    const req = await Request.create(request.body);
    const status = await RequestStatus.findByPk("SUCCESS");
    const requester = await User.findByPk(request.params.userId);

    await req.setStatus(status);
    await req.setRequester(requester);

    response.status(201).json(req.id);
});

exports.acceptRequest = asyncHandler(async (request, response) => {
    const current = new Date();
    const req = await Request.findByPk(request.params.requestId);
    const pickUp = {
        ...req.pickUp,
        date: current.toLocaleDateString(),
        time: `${current.getHours()}:${current.getMinutes()}`
    };

    await Request.update(
        { pickUp: pickUp },
        {
            where: {
                id: request.params.requestId
            }
        }
    );

    response.status(400).json({
        success: true
    });
});

exports.history = asyncHandler(async (request, response) => {});
exports.historyDetails = asyncHandler(async (request, response) => {});

exports.driverHistoryDetails = asyncHandler(async (request, response) => {});
exports.driverHistory = asyncHandler(async (request, response) => {});
exports.getAllRequestsAndPaging = asyncHandler(async (request, response) => {});
exports.getRequestDetails = asyncHandler(async (request, response) => {});

exports.getRequestById = asyncHandler(async (request, response) => {});

exports.getInfoDriver = asyncHandler(async (request, response) => {});
exports.finishRequest = asyncHandler(async (request, response) => {});
exports.pickUpPatient = asyncHandler(async (request, response) => {});
exports.rejectRequest = asyncHandler(async (request, response) => {});
exports.feedbackRequest = asyncHandler(async (request, response) => {});
