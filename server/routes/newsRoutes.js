const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const News = require('../models/News');

// 뉴스용 파일 업로드 설정 (모든 파일 허용)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'news');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const newsUpload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 제한
  }
});

// 정적 파일 제공 설정
router.use('/uploads/news', express.static(path.join(__dirname, '..', 'uploads', 'news')));

// 뉴스 목록 조회 (모든 사용자)
router.get('/', newsController.getAllNews);

// 특정 뉴스 조회 (모든 사용자)
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'department');
    
    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }

    console.log('조회된 뉴스 데이터:', {
      id: news._id,
      title: news.title,
      fileUrl: news.fileUrl,
      fileName: news.fileName,
      fileType: news.fileType
    });

    res.json(news);
  } catch (error) {
    console.error('뉴스 조회 에러:', error);
    res.status(500).json({ message: '뉴스 조회에 실패했습니다.' });
  }
});

// 뉴스 생성 (관리자만)
router.post('/', verifyToken, requireAdmin, newsUpload.single('file'), async (req, res) => {
  try {
    console.log('req.user:', req.user); // 디버깅용
    const { title, content, category } = req.body;
    
    const newsData = {
      title,
      content,
      category,
      author: req.user.id || req.user._id // 둘 다 시도
    };

    if (req.file) {
      newsData.fileUrl = `/uploads/news/${path.basename(req.file.path)}`;
      newsData.fileName = req.file.originalname;
      newsData.fileType = req.file.mimetype;
    }

    const news = new News(newsData);
    await news.save();
    
    res.status(201).json(news);
  } catch (error) {
    console.error('뉴스 생성 에러:', error);
    res.status(500).json({ message: '뉴스 생성에 실패했습니다.' });
  }
});

// 뉴스 수정 (관리자만)
router.put('/:id', verifyToken, requireAdmin, newsUpload.single('file'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const newsData = {
      title,
      content,
      category
    };

    if (req.file) {
      // 기존 파일이 있다면 삭제
      const existingNews = await News.findById(req.params.id);
      if (existingNews?.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', existingNews.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      newsData.fileUrl = `/uploads/news/${req.file.filename}`;
      newsData.fileName = req.file.originalname;
      newsData.fileType = req.file.mimetype;
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      newsData,
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }

    res.json(news);
  } catch (error) {
    console.error('뉴스 수정 에러:', error);
    res.status(500).json({ message: '뉴스 수정에 실패했습니다.' });
  }
});

// 뉴스 삭제 (관리자만)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    console.log('Delete request received:', {
      newsId: req.params.id,
      user: {
        id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
    });

    const news = await News.findById(req.params.id);
    
    if (!news) {
      console.log('News not found:', req.params.id);
      return res.status(404).json({ message: '뉴스를 찾을 수 없습니다.' });
    }

    // 파일 삭제 처리
    if (news.fileUrl) {
      const filePath = path.join(__dirname, '..', news.fileUrl);
      console.log('Attempting to delete file:', filePath);
      
      try {
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
    await News.findByIdAndDelete(req.params.id);
    console.log('News deleted successfully:', req.params.id);

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
});

module.exports = router;
