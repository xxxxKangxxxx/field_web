// server/controllers/qustionController.js
const Question = require('../models/Question');

// 전체 질문 조회
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: '자주 묻는 질문 조회 실패', error: err });
  }
};

// 질문 등록
exports.createQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const newQuestion = new Question({ question, answer });
    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: '질문 등록 실패', error: err });
  }
};

// 질문 삭제
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Question.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: '해당 질문을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '질문 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '질문 삭제 실패', error: err });
  }
};
