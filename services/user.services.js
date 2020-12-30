const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");
const asyncHandler = require("../middlewares/asyncHandler");

exports.signupRequester = asyncHandler(async (req, res) => {
    const username = req.body.username;
    if (await User.findOne({ where: { username: username } })) {
        throw `Username is ${username} already taken`;
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const roleRequester = await Role.findByPk(1);
    const _user = await User.create(req.body);
    await _user.setRole(roleRequester);

    res.status(200).json(omitHash(_user.get()));
});

function omitHash(user) {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}
