const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/', reviewController.getAllReviews); 

// 캠프 ID 기반 리뷰 등록 및 조회
router.get('/camp/:campId', reviewController.getReviewsByCamp);
router.post('/camp/:campId', reviewController.createReview);

// 리뷰 ID 기반 수정 및 삭제
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
