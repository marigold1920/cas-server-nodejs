const asyncHandler = require("../middlewares/asyncHandler");
const model = require("../models/Model.master");
const { updateConfig, getConfig } = require("./dispatcher.service");

exports.getConfiguration = asyncHandler(async (request, response) => {
    const configurations = await model.Configuration.findAll();

    response.status(200).json(configurations);
});

exports.updateSystemConfiguration = asyncHandler(async (request, response) => {
    const configurations = request.body;

    for (let i in configurations) {
        await model.Configuration.update(configurations[i], {
            where: { item_id: configurations[i].itemId }
        });
    }

    updateConfig(configurations);

    response.status(200).json(configurations);
});

exports.getConfig = asyncHandler(async (request, response) => {
    response.status(200).json(getConfig());
});
