const User = require("../models/User");
const { Op } = require("sequelize");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getRequesters = asyncHandler(async (req, res) => {
    var displayName = req.query.displayName;
    var pageIndex = req.query.pageIndex - 1;
    var status = req.query.status;

    const limit = 9;
    const offset = pageIndex ? pageIndex * limit : 0;

    const _data = await User.findAll({
        limit: limit,
        offset: offset,
        where: {
            role_id: 1,
            is_active: status,
            display_name: {
                [Op.like]: `%${displayName}%`
            }
        }
    });

    res.status(200).json(_data);

});

exports.getRequesterDetails = asyncHandler(async(req, res) => {

});

exports.updateHealthInformation = asyncHandler(async(req, res) => {
    
});

exports.grantRequesterPermission = asyncHandler(async(req, res) => {
    
})