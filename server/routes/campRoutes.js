const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Camp = require('../models/Camp');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// 이미지 저장을 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/camps';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'camp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다!'));
    }
  }
});

// 모든 캠프 데이터 조회
router.get('/', async (req, res) => {
  try {
    const camps = await Camp.find().sort({ year: -1 });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 새로운 캠프 데이터 생성
router.post('/', verifyToken, requireAdmin, upload.single('posterImage'), async (req, res) => {
  try {
    const campData = {
      ...req.body,
      posterImage: '/uploads/camps/' + req.file.filename,
      timeline: JSON.parse(req.body.timeline)
    };

    const camp = new Camp(campData);
    const savedCamp = await camp.save();
    res.status(201).json(savedCamp);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// 특정 캠프 데이터 조회
router.get('/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: '캠프를 찾을 수 없습니다.' });
    }
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 캠프 데이터 수정
router.put('/:id', verifyToken, requireAdmin, upload.single('posterImage'), async (req, res) => {
  try {
    const campData = {
      ...req.body,
      timeline: JSON.parse(req.body.timeline)
    };

    if (req.file) {
      campData.posterImage = '/uploads/camps/' + req.file.filename;
      
      // 기존 이미지 삭제
      const oldCamp = await Camp.findById(req.params.id);
      if (oldCamp && oldCamp.posterImage) {
        const oldImagePath = path.join(__dirname, '..', oldCamp.posterImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedCamp = await Camp.findByIdAndUpdate(
      req.params.id,
      campData,
      { new: true }
    );

    if (!updatedCamp) {
      return res.status(404).json({ message: '캠프를 찾을 수 없습니다.' });
    }

    res.json(updatedCamp);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// 캠프 데이터 삭제
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: '캠프를 찾을 수 없습니다.' });
    }

    // 이미지 파일 삭제
    if (camp.posterImage) {
      const imagePath = path.join(__dirname, '..', camp.posterImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await camp.remove();
    res.json({ message: '캠프가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

