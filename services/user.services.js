const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const User = require("../models/User");
const Role = require('../models/Role');
const asyncHandler = require('../middlewares/asyncHandler');

// async function authenticate({ username, password }) {
//     const user = await User.scope('withHash').findOne({ where: { username } });

//     if (!user || !(await bcrypt.compare(password, user.password)))
//         throw 'Username or password is incorrect';

//     // authentication successful
//     const token = jwt.sign({ sub: user.id }, "CAS", { expiresIn: '1d' });
//     return { ...omitHash(user.get()), token };
// }

exports.signupRequester = asyncHandler(async(req, res) => {
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

    res.status(200).json(omitHash(_user.get()))
});


function omitHash(user) {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}
