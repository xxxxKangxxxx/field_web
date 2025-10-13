const multer = require('multer');
const path = require('path');

// 이미지 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/camp-posters/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'camp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 제한
  }
});

module.exports = upload; 