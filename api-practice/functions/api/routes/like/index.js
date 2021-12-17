const express = require('express');
const router = express.Router();

router.post('/', require('./likePOST'));

module.exports = router;
