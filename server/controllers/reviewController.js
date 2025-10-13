const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: '전체 리뷰 조회 실패', error: err });
  }
};

// 특정 캠프의 리뷰 전체 조회
exports.getReviewsByCamp = async (req, res) => {
  try {
    const { campId } = req.params;
    const reviews = await Review.find({ campId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: '리뷰 목록 조회 실패', error: err });
  }
};

// 특정 캠프에 리뷰 작성
exports.createReview = async (req, res) => {
  try {
    const { campId } = req.params;
    const { author, content, rating } = req.body;

    const newReview = new Review({
      campId,
      author,
      content,
      rating
    });

    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: '리뷰 작성 실패', error: err });
  }
};

// 리뷰 수정
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: '해당 리뷰를 찾을 수 없습니다.' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: '리뷰 수정 실패', error: err });
  }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: '삭제할 리뷰를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '리뷰 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '리뷰 삭제 실패', error: err });
  }
};
