const express = require('express');
const router = express.Router();
const recruitController = require('../controllers/recruitController');

// 모집 일정 전체 조회
router.get('/', recruitController.getAllRecruitDates);

// 모집 일정 등록 (관리자용)
router.post('/', recruitController.createRecruitDate);

module.exports = router;
