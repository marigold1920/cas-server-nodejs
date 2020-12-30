const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const model = require("../models/Model.master");
const asyncHandler = require("../middlewares/asyncHandler");

exports.signUpRequester = asyncHandler(async (req, res) => {
    const username = req.body.username;
    if (await model.User.findOne({
        where: {
            username: username,
            role_id: 1
        }
    })) {
        throw `Username is ${username} already taken`;
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const roleRequester = await model.Role.findByPk(1);
    const _user = await model.User.create(req.body);
    await _user.setRole(roleRequester);

    res.status(200).json(omitHash(_user.get()));
});


exports.signUpDriver = asyncHandler(async (req, res) => {
    const username = req.body.username;
    const roleDriver = await model.Role.findByPk(2);
    if (await model.User.findOne({
        where: {
            username: username,
            role_id: 2
        }
    })) {
        throw `Username is ${username} already taken`;
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const _user = await model.User.create(req.body);
    await _user.setRole(roleDriver);

    res.status(200).json(omitHash(_user.get()));
});

exports.authenticateRequester = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.User.scope('withHash').findOne({
        where: {
            username: username,
            role_id: 1
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';
    const token = jwt.sign({ sub: user.id }, 'CAS-SECRET', { expiresIn: '1d' });
    
    res.status(200).json({ ...omitHash(user.get()), token });

});
exports.authenticateDriver = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.User.scope('withHash').findOne({
        where: {
            username: username,
            role_id: 2
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';
    const token = jwt.sign({ sub: user.id }, 'CAS-SECRET', { expiresIn: '1d' });
    
    res.status(200).json({ ...omitHash(user.get()), token });
});
exports.authenticateAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.User.scope('withHash').findOne({
        where: {
            username: username,
            role_id: 3
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'Username or password is incorrect';
    const token = jwt.sign({ sub: user.id }, 'CAS-SECRET', { expiresIn: '1d' });
    
    res.status(200).json({ ...omitHash(user.get()), token });
});
exports.forgetPasswordRequester = asyncHandler(async (req, res) => {

});
exports.forgetPasswordDriver = asyncHandler(async (req, res) => {

});
exports.forgetPasswordAdmin = asyncHandler(async (req, res) => {

});
exports.checkExistedRequester = asyncHandler(async (req, res) => {

});
exports.checkExistedDriver = asyncHandler(async (req, res) => {

});
exports.checkExistedAdmin = asyncHandler(async (req, res) => {

});


function omitHash(user) {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}
