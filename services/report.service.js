const { QueryTypes } = require("sequelize");
const asyncHandler = require("../middlewares/asyncHandler");
const sequelize = require("../configs/database.config");
const queries = require("../configs/database.queries");
const model = require("../models/Model.master");

exports.getReport = asyncHandler(async (request, response) => {
    const current = new Date();
    const startDate = new Date(current.setDate(current.getDate() - 7));
    const configurations = await model.Configuration.findAll();
    const recentlyRequest = await sequelize.query(queries.makeRequestReport, {
        type: QueryTypes.SELECT,
        replacements: { startDate }
    });
    const ambulances = await sequelize.query(queries.findAllAmbulanceAndPaging, {
        type: QueryTypes.SELECT,
        replacements: { offset: 0, pageSize: 4, status: "%%", keyword: "%%" }
    });
    const popularRegion = await sequelize.query(queries.getPopularRegion, {
        type: QueryTypes.SELECT
    });
    const successRate = await sequelize.query(queries.getSuccessRate, {
        type: QueryTypes.SELECT
    });
    const requestReport =
        recentlyRequest.length &&
        recentlyRequest.reduce((acc, cur) => {
            return {
                ...acc,
                [cur.created_date]: cur.amount
            };
        }, {});

    response.status(200).json({
        recentlyRequests: requestReport,
        successRate: successRate[0].rate,
        configurations,
        ambulances,
        popularRegion: popularRegion[0].region
    });
});
