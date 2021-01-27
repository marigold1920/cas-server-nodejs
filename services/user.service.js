const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const model = require("../models/Model.master");
const asyncHandler = require("../middlewares/asyncHandler");
const Constant = require("../utils/constants");
const { response } = require("express");
const { signUpDriverFirestore } = require("../configs/firebase.config");

exports.saveSetting = asyncHandler(async (req, res) => {
    const setting = req.body;
    await model.Setting.update(setting, {
        where: { id: setting.id },
        returning: true
    });

    res.status(200).json(setting);
});

exports.signUpRequester = asyncHandler(async (req, res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const _user = await model.User.create(req.body);
    await _user.setRole(Constant.ROLE_REQUESTER);

    res.status(200).json(omitHash(_user.get()));
});

exports.signUpDriver = asyncHandler(async (req, res) => {
    const username = req.body.username;
    const roleDriver = await model.Role.findByPk(Constant.ROLE_DRIVER);
    const user = await model.User.findOne({
        where: {
            username: username
        }
    });

    if (user) {
        return response.status(400).json();
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const setting = await model.Setting.create({ ...Constant.DEFAULT_SETTING, typeRequest: 6 });
    const _user = await model.User.create(req.body);
    await _user.setRole(roleDriver);
    await setting.setSetting(_user);
    signUpDriverFirestore(username, Constant.DEFAULT_SETTING);

    res.status(200).json(omitHash(_user.get()));
});

exports.updatePersonalProfile = asyncHandler(async (request, response) => {
    const profile = request.body;
    const userId = request.params.userId;

    await model.User.update(profile, {
        where: {
            id: userId
        }
    });

    response.status(200).json(profile);
});

exports.authenticateRequester = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.User.scope("withHash").findOne({
        where: {
            username: username,
            role_id: Constant.ROLE_REQUESTER,
            isActive: true
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw "Username or password is incorrect";
    const token = jwt.sign({ sub: user.id }, process.env.JWT_KEY, { expiresIn: "1d" });

    res.status(200).json({ ...omitHash(user.get()), token });
});

exports.authenticateDriver = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await model.User.scope("withHash").findOne({
        where: {
            username: username,
            role_id: Constant.ROLE_DRIVER,
            isActive: true
        }
    });
    const setting = await model.Setting.findOne({ where: { user_id: user.id } });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw "Username or password is incorrect";
    const token = jwt.sign({ sub: user.id }, process.env.JWT_KEY, { expiresIn: "1d" });

    res.status(200).json({ user: { ...omitHash(user.get()), token }, setting });
});

exports.authenticateAdmin = asyncHandler(async (req, res) => {
    console.log("Oops");
    const { username, password } = req.body;
    const user = await model.User.scope("withHash").findOne({
        where: {
            username: username,
            role_id: 3,
            isActive: true
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
        throw "Username or password is incorrect";
    const token = jwt.sign({ sub: user.id }, process.env.JWT_KEY, { expiresIn: "1d" });

    res.status(200).json({ ...omitHash(user.get()), token });
});

exports.forgetPasswordRequester = asyncHandler(async (req, res) => {
    try {
        await model.User.update(
            { password: await bcrypt.hash(req.body.password, 10) },
            {
                where: {
                    username: req.body.username,
                    role_id: Constant.ROLE_REQUESTER
                }
            }
        );
        res.status(200).json({ message: "Update success" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

exports.forgetPasswordDriver = asyncHandler(async (req, res) => {
    try {
        await model.User.update(
            { password: await bcrypt.hash(req.body.password, 10) },
            {
                where: {
                    username: req.body.username,
                    role_id: Constant.ROLE_DRIVER
                }
            }
        );
        res.status(200).json({ message: "Update success" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

exports.forgetPasswordAdmin = asyncHandler(async (req, res) => {
    try {
        await model.User.update(
            { password: await bcrypt.hash(req.body.password, 10) },
            {
                where: {
                    username: req.body.username,
                    role_id: 3
                }
            }
        );

        res.status(200).json({ message: "Update success" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

exports.checkExistedUser = asyncHandler(async (req, res) => {
    const username = req.query.username;
    const user = await model.User.findOne({
        where: {
            username: username
        }
    });

    res.status(200).json(user ? user.username : null);
});

function omitHash(user) {
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
}
