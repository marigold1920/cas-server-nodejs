const User = require("../models/User");
const Role = require("../models/Role");
const asyncHandler = require("../middlewares/asyncHandler");

exports.registerRequester = asyncHandler(async (request, response) => {
    const role = await Role.findByPk(1);
    const user = {
        username: "0988635032",
        password: "12345678",
        phone: "0988635032",
        displayName: "Victor Nguyễn"
    };
    const _user = await User.create(user);

    const data = await role.addUser(_user);

    response.status(201).json(data);
});
