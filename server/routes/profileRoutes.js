const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// 전체 조회
router.get('/', profileController.getAllProfiles);

// 등록
router.post('/', profileController.createProfile);

// 삭제
router.delete('/:id', profileController.deleteProfile);

module.exports = router;
