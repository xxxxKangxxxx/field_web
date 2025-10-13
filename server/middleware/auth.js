const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// 관리자 권한 확인 미들웨어
const requireManager = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

module.exports = { auth, requireManager }; 