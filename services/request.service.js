const model = require("../models/Model.master");
const sequelize = require("../configs/database.config");
const asyncHandler = require("../middlewares/asyncHandler");
const queries = require("../configs/databse.queries");
const Constant = require("../utils/constants");
const { QueryTypes } = require("sequelize");

exports.saveRequest = asyncHandler(async (request, response) => {
    const req = await model.Request.create(request.body);
    const userId = request.params.userId;

    await req.setStatus(Constant.PROCESSING_REQUEST_STATUS);
    await req.setRequester(userId);
    await sequelize.query(queries.updateSuccessRateForRequester, {
        type: QueryTypes.UPDATE,
        replacements: { userId }
    });

    response.status(201).json(req.id);
});

exports.acceptRequest = asyncHandler(async (request, response) => {
    const { driverId, requestId } = request.params;
    const ambulance = await model.Ambulance.findOne({
        where: { driver_id: driverId, ambulance_status: Constant.ACTIVE_AMBULANCE_STATUS }
    });
    const _request = await model.Request.findByPk(requestId);

    await _request.setDriver(driverId);
    await _request.setAmbulance(ambulance);
    await sequelize.query(queries.updateSuccessRateForDriver, {
        type: QueryTypes.UPDATE,
        replacements: { userId: driverId }
    });

    response.status(200).json();
});

exports.history = asyncHandler(async (request, response) => {
    const userId = request.params.userId;
    const pageIndex = request.query.pageIndex;
    const history = await sequelize.query(queries.getRequesterHistory, {
        type: QueryTypes.SELECT,
        replacements: {
            userId,
            offset: (pageIndex - 1) * Constant.PAGE_SIZE,
            pageSize: Constant.PAGE_SIZE
        }
    });

    response.status(200).json(history);
});

exports.historyDetails = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: {
            exclude: [
                "driver_id",
                "requester_id",
                "ambulance_id",
                "region",
                "createdDate",
                "isOther"
            ]
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
        ]
    });

    response.status(200).json(_request);
});

exports.driverHistoryDetails = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: {
            exclude: [
                "driver_id",
                "requester_id",
                "ambulance_id",
                "region",
                "createdDate",
                "healthInformation",
                "isOther"
            ]
        },
        include: [
            {
                model: model.User,
                as: "requester",
                attributes: ["displayName", "imageUrl", "phone"]
            }
        ]
    });

    response.status(200).json(_request);
});

exports.driverHistory = asyncHandler(async (request, response) => {
    const userId = request.params.userId;
    const pageIndex = request.query.pageIndex;
    const history = await sequelize.query(queries.getDriverHistory, {
        type: QueryTypes.SELECT,
        replacements: {
            userId,
            offset: (pageIndex - 1) * Constant.PAGE_SIZE,
            pageSize: Constant.PAGE_SIZE
        }
    });

    response.status(200).json(history);
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

    response.status(200).json(requests);
});

exports.getRequestDetails = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: {
            exclude: ["driver_id", "requester_id", "ambulance_id", "region", "isOther"]
        },
        include: [
            {
                model: model.User,
                as: "driver",
                attributes: ["displayName", "imageUrl"]
            },
            {
                model: model.User,
                as: "requester",
                attributes: ["displayName", "imageUrl"]
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

exports.getRequestById = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const _request = await model.Request.findByPk(requestId, {
        attributes: [
            ["id", "requestId"],
            "pickUp",
            "destination",
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
        }
    });

    response.status(200).json(_request);
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
    const current = new Date();
    const req = await model.Request.findByPk(request.params.requestId);
    const destination = {
        ...req.destination,
        date: current.toLocaleDateString(),
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

    response.status(200).json();
});

exports.pickUpPatient = asyncHandler(async (request, response) => {
    const current = new Date();
    const req = await model.Request.findByPk(request.params.requestId);
    const pickUp = {
        ...req.pickUp,
        date: current.toLocaleDateString(),
        time: `${String(current.getHours()).padStart(2, "0")}:${String(
            current.getMinutes()
        ).padStart(2, "0")}`
    };

    await req.update({ pickUp: pickUp });

    response.status(200).json();
});

exports.cancelRequest = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    await model.Request.update(
        {
            request_status: Constant.CANCELED_REQUEST_STATUS,
            reason: Constant.CANCELED_REASON
        },
        { where: { id: requestId } }
    );

    response.status(200).json(requestId);
});

exports.rejectRequest = asyncHandler(async (request, response) => {
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
        replacements: { userId: req.driverId }
    });

    response.status(200).json(requestId);
});

exports.feedbackRequest = asyncHandler(async (request, response) => {
    const requestId = request.params.requestId;
    const feedback = request.body;

    await model.Request.update(feedback, { where: { id: requestId } });

    response.status(200).json(requestId);
});
