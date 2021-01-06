const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../configs/database.config");

const asyncHandler = require("../middlewares/asyncHandler");
const Constant = require("../utils/constants");
const model = require("../models/Model.master");
const queries = require("../configs/database.queries");

exports.getAllDriversAndPaging = asyncHandler(async (request, response) => {
    const { pageIndex, keyword } = request.query;
    const drivers = await model.User.findAll({
        attributes: [
            "id",
            "displayName",
            "imageUrl",
            "phone",
            "dateCreated",
            "numOfRequests",
            "successRate",
            ["is_active", "status"]
        ],
        limit: Constant.PAGE_SIZE,
        offset: (pageIndex - 1) * Constant.PAGE_SIZE,
        where: {
            displayName: {
                [Op.like]: `%${keyword}%`
            },
            role_id: 2
        }
    });

    response.status(200).json(drivers);
});

exports.getDriverDetails = asyncHandler(async (request, response) => {
    const userId = request.params.driverId;
    const feedback = await sequelize.query(queries.getDriverDetails, {
        type: QueryTypes.SELECT,
        replacements: { userId }
    });

    response.status(200).json(feedback);
});

exports.registerAmbulance = asyncHandler(async (request, response) => {
    const ambulance = await model.Ambulance.create(request.body);

    await ambulance.setDriver(request.params.driverId);
    await ambulance.setStatus(Constant.DEFAULT_AMBULANCE_STATUS);

    response.status(201).json(ambulance);
});

exports.updateAmbulance = asyncHandler(async (request, response) => {
    let ambulance = request.body;
    await model.Ambulance.update(
        { ...ambulance, note: null },
        {
            where: {
                id: ambulance.ambulanceId
            }
        }
    );

    ambulance = await model.Ambulance.findByPk(ambulance.ambulanceId);
    await ambulance.setStatus("CONFIRMING");

    response.status(200).json(ambulance);
});

exports.grantDriverPermission = asyncHandler(async (request, response) => {
    const userId = request.params.driverId;
    const driver = await model.User.findByPk(userId);

    if (driver.isActive) {
        const isInRequest = await sequelize.query(queries.isJoinInRequest, {
            type: QueryTypes.SELECT,
            replacements: { userId }
        });

        if (isInRequest.length) {
            response.status(400).json();
            return;
        }
    }

    await driver.update({ isActive: !driver.isActive });

    response.status(200).json(driver.isActive);
});

exports.unregisterAmbulance = asyncHandler(async (request, response) => {
    await model.Ambulance.update(
        { ambulance_status: "CANCELED", note: null },
        {
            where: {
                id: request.params.ambulanceId
            }
        }
    );

    response.status(200).json(request.params.ambulanceId);
});
