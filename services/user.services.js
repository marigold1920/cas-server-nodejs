// const User = require("../models/User");
// const Role = require("../models/Role");
// const asyncHandler = require("../middlewares/asyncHandler");

// exports.registerRequester = asyncHandler(async (request, response) => {
//     const role = await Role.findByPk(1);
//     const user = {
//         username: "0988635032",
//         password: "12345678",
//         phone: "0988635032",
//         displayName: "Victor Nguyễn"
//     };

//     const _user = await User.create(user);

//     const data = await role.addUser(_user);

//     response.status(201).json(data);
// });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/User");
const Role = require('../models/Role');
module.exports = {
    authenticate,
    signupRequester,
};

async function authenticate({ username, password }) {
    const user = await User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, "CAS", { expiresIn: '1d' });
    return { ...omitHash(user.get()), token };
}

async function signupRequester(params) {
    if (await User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    const roleRequester = await Role.findByPk(1);
    // save user
    const _user = await User.create(params);
    // const data = await roleRequester.addUser(_user);
    await _user.setRole(roleRequester);

    return omitHash(_user.get());;
} 

function omitHash(user) {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}
