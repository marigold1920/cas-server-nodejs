const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../configs/database.config");

const asyncHandler = require("../middlewares/asyncHandler");
const Constant = require("../utils/constants");
const model = require("../models/Model.master");
const queries = require("../configs/databse.queries");

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
            }
        },
        include: {
            model: model.Role,
            as: "role",
            attributes: [],
            where: { roleId: 2 }
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
    await model.Ambulance.update(ambulance, {
        where: {
            id: ambulance.ambulanceId
        }
    });

    ambulance = await model.Ambulance.findByPk(ambulance.ambulanceId);
    await ambulance.setStatus("CONFIRMING");

    response.status(200).json(ambulance);
});

exports.grantDriverPermission = asyncHandler(async (request, response) => {});
