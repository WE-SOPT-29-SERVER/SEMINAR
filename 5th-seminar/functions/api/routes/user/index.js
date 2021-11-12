const express = require('express');
const router = express.Router();

// '/user/signup'으로 오는 요청을 userSignupPOST 파일에서 처리
router.get('/', require('./userGET'));
router.get('/:userId', require('./userByIdGET'));

module.exports = router;
