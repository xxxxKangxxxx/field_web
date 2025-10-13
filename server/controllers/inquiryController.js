const Inquiry = require('../models/Inquiry');

// 모든 문의사항 조회 (관리자용)
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: '문의사항 조회 중 오류가 발생했습니다.' });
  }
};

// 사용자 본인의 문의사항 조회
exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      email: req.user.email  // 로그인한 사용자의 이메일로 조회
    }).sort({ createdAt: -1 });
    
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: '문의사항 조회 중 오류가 발생했습니다.' });
  }
};

// 문의사항 생성
exports.createInquiry = async (req, res) => {
  try {
    const { type, title, content, name, email, phone } = req.body;
    
    const inquiry = new Inquiry({
      type,
      title,
      content,
      name,
      email,
      phone,
      status: 'pending'  // 기본 상태를 명시적으로 설정
    });

    await inquiry.save();
    res.status(201).json({ message: '문의사항이 성공적으로 등록되었습니다.' });
  } catch (error) {
    console.error('문의사항 등록 에러:', error);
    res.status(400).json({ message: '문의사항 등록 중 오류가 발생했습니다.', error: error.message });
  }
};

// 특정 문의사항 조회
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: '문의사항을 찾을 수 없습니다.' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: '문의사항 조회 중 오류가 발생했습니다.' });
  }
};

// 문의사항 상태 업데이트
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ message: '문의사항을 찾을 수 없습니다.' });
    }
    
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: '문의사항 상태 업데이트 중 오류가 발생했습니다.' });
  }
};

// 문의사항 삭제
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: '문의사항을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '문의사항이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '문의사항 삭제 중 오류가 발생했습니다.' });
  }
}; 