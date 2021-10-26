const express = require("express");
const router = express.Router();

// /user/signup
router.post("/signup", require("./userSignupPOST"));
router.post("/login", require("./userLoginPOST"));

module.exports = router;
