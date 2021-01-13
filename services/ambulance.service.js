const asyncHandler = require("../middlewares/asyncHandler");
const model = require("../models/Model.master");
const sequelize = require("../configs/database.config");
const queries = require("../configs/database.queries");
const Constant = require("../utils/constants");
const { QueryTypes } = require("sequelize");

exports.findAllAmbulancesAndPaging = asyncHandler(async (request, response) => {
    const { pageIndex, keyword, status } = request.query;

    const ambulances = await sequelize.query(queries.findAllAmbulanceAndPaging, {
        type: QueryTypes.SELECT,
        replacements: {
            offset: (pageIndex - 1) * Constant.PAGE_SIZE,
            pageSize: Constant.PAGE_SIZE,
            status: `%${status}%`,
            keyword: `%${keyword}%`
        }
    });

    response.status(200).json(ambulances);
});

exports.getAmbulanceDetails = asyncHandler(async (request, response) => {
    const ambulance = await sequelize.query(queries.getAmbulanceDetails, {
        type: QueryTypes.SELECT,
        replacements: { ambulanceId: request.params.ambulanceId }
    });

    response.status(200).json(ambulance);
});

exports.findAmbulance = asyncHandler(async (request, response) => {
    const driverId = request.params.driverId;
    const ambulance = await model.Ambulance.findOne({
        attributes: {
            exclude: ["driver_id", "expirationDate"]
        },
        where: {
            driver_id: driverId,
            ambulance_status: [Constant.ACTIVE_AMBULANCE_STATUS, Constant.DEFAULT_AMBULANCE_STATUS]
        }
    });

    response.status(200).json(ambulance);
});

exports.grantAmbulancePermission = asyncHandler(async (request, response) => {
    const ambulanceId = request.params.ambulanceId;
    const _request = await model.Request.findOne({
        where: {
            ambulance_id: ambulanceId,
            request_status: [Constant.PROCESSING_REQUEST_STATUS]
        }
    });

    if (_request) {
        response.status(400).json();
        return;
    }

    const ambulance = await model.Ambulance.findByPk(ambulanceId);
    const status =
        ambulance.ambulance_status === Constant.ACTIVE_AMBULANCE_STATUS
            ? Constant.DEACTIVE_AMBULANCE_STATUS
            : Constant.ACTIVE_AMBULANCE_STATUS;
    await ambulance.setStatus(status);

    response.status(200).json(Constant[status]);
});

exports.acceptRegisterAmbulance = asyncHandler(async (request, response) => {
    await model.Ambulance.update(
        {
            ambulance_status: Constant.ACTIVE_AMBULANCE_STATUS,
            note: null
        },
        {
            where: {
                id: request.params.ambulanceId
            }
        }
    );

    response.status(200).json(Constant["ACTIVE"]);
});

exports.rejectRegisteAmbulance = asyncHandler(async (request, response) => {
    await model.Ambulance.update(
        {
            note: request.body
        },
        {
            where: {
                id: request.params.ambulanceId
            }
        }
    );

    response.status(200).json(Constant["CONFIRMING"]);
});
