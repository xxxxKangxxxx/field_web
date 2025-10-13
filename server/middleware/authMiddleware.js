// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No authorization header');
      return res.status(401).json({ message: '인증 헤더가 없습니다.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in auth header');
      return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    console.log('Verifying token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', {
      id: decoded._id,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    });

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    }
    res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};

exports.requireAdmin = (req, res, next) => {
  console.log('Checking admin rights for user:', {
    id: req.user?._id,
    email: req.user?.email,
    isAdmin: req.user?.isAdmin
  });

  if (!req.user) {
    console.log('No user found in request');
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }

  if (!req.user.isAdmin) {
    console.log('User is not admin:', req.user.email);
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }

  console.log('Admin rights verified for:', req.user.email);
  next();
};
