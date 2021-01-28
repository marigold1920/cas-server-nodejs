const { Op, QueryTypes } = require("sequelize");
const asyncHandler = require("../middlewares/asyncHandler");
const model = require("../models/Model.master");
const Constant = require("../utils/constants");
const sequelize = require("../configs/database.config");
const queries = require("../configs/database.queries");

exports.findAllRequestersAndPaging = asyncHandler(async (request, response) => {
    const { pageIndex, keyword, status } = request.query;
    const conditions = {
        displayName: {
            [Op.like]: `%${keyword}%`
        },
        is_active: {
            [Op.like]: `%${status === "Đang hoạt động" ? 1 : status ? 0 : ""}%`
        },
        role_id: 1
    };
    const requesters = await model.User.findAll({
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
        where: conditions
    });
    const count = await model.User.count({ where: conditions });

    response.status(200).json({
        data: requesters,
        totalPage: Math.ceil((count * 1.0) / Constant.PAGE_SIZE),
        currentPage: Number.parseInt(pageIndex)
    });
});

exports.getRequesterDetails = asyncHandler(async (request, response) => {
    const details = await sequelize.query(queries.findByRequesterId, {
        type: QueryTypes.SELECT,
        replacements: { userId: request.params.requesterId }
    });

    response.status(200).json(details);
});

exports.updateHealthInformation = asyncHandler(async (request, response) => {
    const healthInformation = request.body;

    await model.User.update(
        { healthInformation },
        {
            where: {
                id: request.params.userId
            }
        }
    );

    response.status(200).json(healthInformation);
});

exports.grantRequesterPermission = asyncHandler(async (request, response) => {
    const userId = request.params.requesterId;

    const isInRequest = await sequelize.query(queries.isJoinInRequest, {
        type: QueryTypes.SELECT,
        replacements: { userId }
    });

    if (isInRequest.length) {
        response.status(400).json();
        return;
    }

    const requester = await model.User.findByPk(userId);

    await requester.update({ isActive: !requester.isActive });

    response.status(200).json(requester.isActive);
});
