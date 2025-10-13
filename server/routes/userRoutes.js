const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// 사용자 프로필 업데이트
router.put('/profile', auth, userController.updateProfile);

module.exports = router; 