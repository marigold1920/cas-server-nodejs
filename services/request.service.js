const model = require("../models/Model.master");
const sequelize = require("../configs/database.config");
const asyncHandler = require("../middlewares/asyncHandler");
const queries = require("../configs/database.queries");
const Constant = require("../utils/constants");
const { calculateRemainingTime } = require("../utils/helper");
const { QueryTypes, Op } = require("sequelize");
const { pushEvent, popEvent, addToBlackList } = require("./dispatcher.service");
const { acceptRequest, updateRequestStatus } = require("../configs/firebase.config");

exports.saveRequest = asyncHandler(async (request, response) => {
    const _request = request.body;
    const {
        pickUp: { latitude, longitude },
        isEmergency
    } = _request;
    const req = await model.Request.create({
        ..._request
    });
    const userId = request.params.userId;

    await req.setStatus(Constant.PROCESSING_REQUEST_STATUS);
    await req.setRequester(userId);
    await sequelize.query(queries.updateSuccessRateForRequester, {
        type: QueryTypes.UPDATE,
        replacements: { userId }
    });

    pushEvent({
        requestId: String(req.id),
        latitude,
        longitude,
        type: isEmergency ? "emergency" : "home"
    });

    response.status(201).json(req.id);
});

exports.acceptRequest = asyncHandler(async (request, response) => {
    const { driverId } = request.params;
    const { requestId, username } = request.query;

    const _request = await model.Request.findOne({
        where: { id: requestId, driver_id: null }
    });

    if (!_request) {
        response.status(400).json();
        return;
    }

    const ambulance = await model.Ambulance.findOne({
        where: { driver_id: driverId, ambulance_status: Constant.ACTIVE_AMBULANCE_STATUS }
    });

    if (!ambulance) {
        response.status(400).json();
        return;
    }

    await _request.setDriver(driverId);
    await _request.setAmbulance(ambulance);
    await sequelize.query(queries.updateSuccessRateForDriver, {
        type: QueryTypes.UPDATE,
        replacements: { userId: driverId }
    });
    acceptRequest(username, requestId);
    popEvent(requestId);

    response.status(200).json();
});

exports.rejectedRequest = asyncHandler(async (request, response) => {
    await model.Request.update(
        { reason: Constant.REJECTED_REASON, request_status: Constant.CANCELED_REQUEST_STATUS },
        {
            where: { id: request.params.requestId }
        }
    );

    response.status(200).json();
});

exports.history = asyncHandler(async (request, response) => {
    const userId = request.params.userId;
    const pageIndex = request.query.pageIndex;
    console.log(pageIndex);
    const history = await model.Request.findAll({
        attributes: {
            exclude: ["driver_id", "requester_id", "ambulance_id", "region", "healthInformation"]
        },
        include: [
            {
                model: model.User,
                as: "driver",
                attributes: ["displayName", "imageUrl", "phone"]
            },
            {
                model: model.Ambulance,
                as: "ambulance",
                attributes: ["licensePlate"]
            }
        ],
        where: { requester_id: userId },
        offset: (pageIndex - 1) * Constant.PAGE_SIZE,
        limit: Constant.PAGE_SIZE,
        order: [["id", "DESC"]]
    });
    const count = await model.Request.count({ where: { requester_id: userId } });

    response.status(200).json({
        data: history,
        totalPage: Math.ceil((count / Constant.PAGE_SIZE) * 1.0),
        currentPage: pageIndex
    });
});

exports.driverHistory = asyncHandler(async (request, response) => {
    const userId = request.params.userId;
    const pageIndex = request.query.pageIndex;
    const history = await model.Request.findAll({
        attributes: {
            exclude: ["driver_id", "requester_id", "ambulance_id", "region", "healthInformation"]
        },
        include: [
            {
                model: model.User,
                as: "requester",
                attributes: ["displayName", "imageUrl", "phone"]
            }
        ],
        where: { driver_id: userId },
        offset: (pageIndex - 1) * Constant.PAGE_SIZE,
        limit: Constant.PAGE_SIZE,
        order: [["id", "DESC"]]
    });
    const count = await model.Request.count({ where: { driver_id: userId } });

    response.status(200).json({
        data: history,
        totalPage: Math.ceil((count / Constant.PAGE_SIZE) * 1.0),
        currentPage: pageIndex
    });
});

exports.getAllRequestsAndPaging = asyncHandler(async (request, response) => {
    const { keyword, status, pageIndex } = request.query;
    const requests = await sequelize.query(queries.getRequestsForAdmin, {
        type: QueryTypes.SELECT,
        replacements: {
            keyword: `%${keyword}%`,
            status: `%${status}%`,
            offset: (pageIndex - 1) * Constant.PAGE_SIZE,
            pageSize: Constant.PAGE_SIZE
        }
    });
    const count = await sequelize.query(queries.countRequests, {
        type: QueryTypes.SELECT,
        replacements: {
            keyword: `%${keyword}%`,
            status: `%${status}%`
        }
    });

    response.status(200).json({
        data: requests,
        totalPage: Math.ceil((count[0].count / Constant.PAGE_SIZE) * 1.0),
        currentPage: Number.parseInt(pageIndex)
    });
});

exports.getRequestDetails = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: {
            exclude: ["driver_id", "requester_id", "ambulance_id", "region"]
        },
        include: [
            {
                model: model.User,
                as: "driver",
                attributes: ["displayName", "imageUrl", "phone"]
            },
            {
                model: model.User,
                as: "requester",
                attributes: ["displayName", "imageUrl", "phone"]
            },
            {
                model: model.Ambulance,
                as: "ambulance",
                attributes: ["licensePlate"]
            },
            {
                model: model.RequestStatus,
                as: "status",
                attributes: ["name"]
            }
        ]
    });
    response.status(200).json(_request);
});

exports.getRequests = asyncHandler(async (request, response) => {
    const requestIds = request.query.requestId;
    let timeout = await model.Configuration.findByPk(1);
    let requests = await model.Request.findAll({
        attributes: [
            ["id", "requestId"],
            "pickUp",
            "destination",
            ["created_date", "createdDate"],
            ["created_time", "createdTime"],
            "patientName",
            "patientPhone",
            "morbidity",
            "morbidityNote",
            "healthInformation",
            "isEmergency",
            "isOther"
        ],
        include: {
            model: model.User,
            as: "requester",
            attributes: ["displayName", "phone"]
        },
        where: { id: requestIds }
    });

    requests = requests.map(r => r.get({ plain: true }));
    timeout = timeout.get({ plain: true });

    response.status(200).json(calculateRemainingTime(requests, timeout.value));
});

exports.getInfoDriver = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: [["id", "requestId"], "pickUp", "destination"],
        include: [
            {
                model: model.User,
                as: "driver",
                attributes: [["display_name", "driverName"], "imageUrl", "phone", "ratingLevel"]
            },
            {
                model: model.Ambulance,
                as: "ambulance",
                attributes: ["licensePlate"]
            }
        ]
    });

    response.status(200).json(_request);
});

exports.finishRequest = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const current = new Date();
    const req = await model.Request.findByPk(requestId);
    const destination = {
        ...req.destination,
        date: current.toLocaleDateString("vi-VN"),
        time: `${String(current.getHours()).padStart(2, "0")}:${String(
            current.getMinutes()
        ).padStart(2, "0")}`
    };

    await req.update({ destination: destination, request_status: Constant.SUCCESS_REQUEST_STATUS });
    await sequelize.query(queries.updateSuccessRateForDriver, {
        type: QueryTypes.UPDATE,
        replacements: { userId: req.driver_id }
    });
    await sequelize.query(queries.updateSuccessRateForRequester, {
        type: QueryTypes.UPDATE,
        replacements: { userId: req.requester_id }
    });
    updateRequestStatus(requestId, Constant.FINISHED_REQUEST_STATUS);

    response.status(200).json();
});

exports.pickUpPatient = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const current = new Date();
    const req = await model.Request.findByPk(requestId);
    const pickUp = {
        ...req.pickUp,
        date: current.toLocaleDateString("vi-VN"),
        time: `${String(current.getHours()).padStart(2, "0")}:${String(
            current.getMinutes()
        ).padStart(2, "0")}`
    };

    await req.update({ pickUp: pickUp });
    updateRequestStatus(requestId, Constant.PICKED_PATIENT_STATUS);

    response.status(200).json();
});

exports.cancelRequestRequester = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    await model.Request.update(
        {
            request_status: Constant.CANCELED_REQUEST_STATUS,
            reason: Constant.CANCELED_REASON
        },
        { where: { id: requestId } }
    );
    popEvent(requestId);

    response.status(200).json(requestId);
});

exports.cancelRequestDriver = asyncHandler(async (request, response) => {
    const { requestId, reason } = request.body;

    await model.Request.update(
        {
            request_status: Constant.FAIL_REQUEST_STATUS,
            reason
        },
        { where: { id: requestId } }
    );
    await sequelize.query(queries.updateSuccessRateForDriver, {
        type: QueryTypes.UPDATE,
        replacements: { userId: request.params.driverId }
    });
    updateRequestStatus(requestId, Constant.REJECTED_REQUEST_STATUS);

    response.status(200).json(requestId);
});

exports.rejectRequest = asyncHandler(async (request, response) => {
    const { requestId, username } = request.query;

    addToBlackList([].concat(requestId), username);

    response.status(200).json();
});

exports.feedbackRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const feedback = req.body;
    const request = await model.Request.findByPk(requestId);
    await sequelize.query(queries.updateRating, {
        type: QueryTypes.UPDATE,
        replacements: { userId: request.driver_id }
    });

    await model.Request.update(feedback, { where: { id: requestId } });

    res.status(200).json(requestId);
});
