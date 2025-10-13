const express = require('express');
const router = express.Router();
const { auth, requireManager } = require('../middleware/auth');
const {
  getAllInquiries,
  createInquiry,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getUserInquiries
} = require('../controllers/inquiryController');

// 문의사항 목록 조회 (관리자만)
router.get('/all', auth, requireManager, getAllInquiries);

// 사용자 본인의 문의사항 조회
router.get('/', auth, getUserInquiries);

// 문의사항 생성 (로그인한 사용자만)
router.post('/', auth, createInquiry);

// 특정 문의사항 조회 (관리자만)
router.get('/:id', auth, requireManager, getInquiry);

// 문의사항 상태 업데이트 (관리자만)
router.patch('/:id/status', auth, requireManager, updateInquiryStatus);

// 문의사항 삭제 (관리자만)
router.delete('/:id', auth, requireManager, deleteInquiry);

module.exports = router; 