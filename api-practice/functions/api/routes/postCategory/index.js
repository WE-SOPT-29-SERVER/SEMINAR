const express = require('express');
const { checkUser } = require('../../../middlewares/auth');
const router = express.Router();

router.get('/:postCategoryId', checkUser, require('./postCategoryGET'));

module.exports = router;
