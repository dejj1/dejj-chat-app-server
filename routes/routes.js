const express = require("express");
const registerUser = require("../controllers/registerUser");
const checkEmail = require("../controllers/checkEmail");
const checkPassword = require("../controllers/checkPassword");
const userDetails = require("../controllers/userDetails");
const logOut = require("../controllers/logOut");
const updateUserDetails = require("../controllers/updateUserDetails");

const router = express.Router();

// create user api

router.post("/register", registerUser);

// check user email
router.post("/email", checkEmail);

// check user password
router.post("/password", checkPassword);

// login user details
router.get("/user-details", userDetails);

// logout user
router.get("/logout", logOut);

// update user details
router.post("/update-user", updateUserDetails);
module.exports = router;
