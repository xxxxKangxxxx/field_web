// server/routes/qustionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// 자주 묻는 질문 전체 조회
router.get('/', questionController.getAllQuestions);

// 질문 등록
router.post('/', questionController.createQuestion);

// 질문 삭제
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
