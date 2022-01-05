const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/user', require('./user'));
router.use('/post', require('./post'));

router.use('/like', require('./like'));

router.use('/post-category', require('./postCategory'));

router.use('/comment', require('./comment'));

module.exports = router;