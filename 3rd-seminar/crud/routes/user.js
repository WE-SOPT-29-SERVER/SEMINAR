const express = require("express");
const router = express.Router();

/* 

sign up
METHOD : POST
URI : localhost:3000/user/signup
REQUEST BODY : id, name, password, email
RESPONSE STATUS : 200 (OK)
RESPONSE DATA : All User Data

*/

router.post("/signup", (req, res) => {});

module.exports = router;
