const express = require("express");

const {
    authenticateRequester,
    authenticateDriver,
    authenticateAdmin,
    signUpRequester,
    signUpDriver,
    forgetPasswordRequester,
    forgetPasswordDriver,
    forgetPasswordAdmin,
    checkExistedUser,
    updatePersonalProfile,
    saveSetting
} = require("../services/user.service");

const router = express.Router();

router.post("/login_requester", authenticateRequester);
router.post("/login_driver", authenticateDriver);
router.post("/login_admin", authenticateAdmin);
router.post("/signup_requester", signUpRequester);
router.post("/signup_driver", signUpDriver);
router.put("/:userId/profile", updatePersonalProfile);
router.put("/requesters/forget_password", forgetPasswordRequester);
router.put("/setting", saveSetting);
router.put("/drivers/forget_password", forgetPasswordDriver);
router.put("/admins/forget_password", forgetPasswordAdmin);
router.get("/check_exist", checkExistedUser);

module.exports = router;
