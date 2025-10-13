const News = require('../models/News');
const fs = require('fs');
const path = require('path');

// 모든 뉴스 조회
exports.getAllNews = async (req, res) => {
  try {
    console.log('뉴스 목록 조회 시도');
    const news = await News.find()
      .sort({ createdAt: -1 })
      .select('title content category imageUrl createdAt')  // imageUrl로 필드명 변경
    console.log('조회된 뉴스:', news);
    res.status(200).json(news);
  } catch (error) {
    console.error('뉴스 목록 조회 실패:', error);
    res.status(500).json({ 
      message: '뉴스 목록을 불러오는데 실패했습니다.', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// 특정 뉴스 조회
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name');
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 뉴스 생성
exports.createNews = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const news = new News({
      ...req.body,
      imageUrl,
      author: req.user._id
    });

    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('파일 삭제 실패:', err);
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// 뉴스 수정 
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }

    // 작성자만 수정 가능
    if (news.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    // 새 이미지가 업로드된 경우
    if (req.file) {
      // 기존 이미지가 있다면 삭제
      if (news.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', news.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== 'ENOENT') console.error('기존 이미지 삭제 실패:', err);
        });
      }
      news.imageUrl = `/uploads/${req.file.filename}`;
    }

    // 다른 필드 업데이트
    Object.assign(news, {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });

    const updatedNews = await news.save();
    res.status(200).json(updatedNews);
  } catch (error) {
    // 에러 발생 시 업로드된 파일 삭제
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('파일 삭제 실패:', err);
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// 뉴스 삭제
exports.deleteNews = async (req, res) => {
  try {
    // 요청 정보 로깅
    console.log('Delete request received:', {
      newsId: req.params.id,
      userInfo: req.user ? {
        id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      } : 'No user info'
    });

    // 사용자 인증 확인
    if (!req.user) {
      console.log('User not authenticated');
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    // 관리자 권한 확인
    if (!req.user.isAdmin) {
      console.log('User not authorized:', req.user.email);
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    // 뉴스 찾기
    const news = await News.findById(req.params.id);
    console.log('Found news:', news);
    
    if (!news) {
      console.log('News not found:', req.params.id);
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }

    // 파일 삭제 시도
    if (news.fileUrl) {
      try {
        const filePath = path.join(__dirname, '..', news.fileUrl);
        console.log('Attempting to delete file:', filePath);
        
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('File deleted successfully:', filePath);
        } else {
          console.log('File not found:', filePath);
        }
      } catch (fileError) {
        console.error('File deletion error:', fileError);
        // 파일 삭제 실패는 무시하고 계속 진행
      }
    }

    // 뉴스 삭제
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    console.log('News deleted successfully:', deletedNews._id);

    res.status(200).json({ 
      success: true,
      message: '뉴스가 성공적으로 삭제되었습니다.',
      deletedId: req.params.id
    });

  } catch (error) {
    console.error('News deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: '뉴스 삭제 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
