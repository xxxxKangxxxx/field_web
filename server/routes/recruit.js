const express = require('express');
const router = express.Router();
const { auth, requireManager } = require('../middleware/auth');
const {
  getAllSchedules,
  getActiveSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/recruitController');

// 모든 모집 일정 조회
router.get('/all', getAllSchedules);

// 활성화된 모집 일정 조회
router.get('/active', getActiveSchedule);

// 모집 일정 생성 (관리자만)
router.post('/', auth, requireManager, createSchedule);

// 모집 일정 수정 (관리자만)
router.patch('/:id', auth, requireManager, updateSchedule);

// 모집 일정 삭제 (관리자만)
router.delete('/:id', auth, requireManager, deleteSchedule);

module.exports = router; 