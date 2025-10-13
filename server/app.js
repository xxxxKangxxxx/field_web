const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const campRoutes = require('./routes/campRoutes');
const newsRoutes = require('./routes/newsRoutes');
const recruitRoutes = require('./routes/recruit');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes');
const questionRoutes = require('./routes/questionRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiries');
const { verifyToken, requireAdmin } = require('./middleware/authMiddleware');
const path = require('path');
const app = express(); 

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // 프론트엔드 주소
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 미들웨어 등록
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// 정적 파일 서빙 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우터 등록
app.use('/api/camps', campRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/recruit', recruitRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);

// 기본 루트 확인용
app.get('/', (req, res) => {
  res.send('<h1>Server is Okay<h1>');
});

// 404 에러 핸들러
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map(error => error.message).join(', ')
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      message: '이미 사용 중인 이메일입니다.'
    });
  }

  res.status(err.status || 500).json({
    message: err.message || '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB 연결 성공!');
  app.listen(4001, () => console.log('🚀 서버 실행 중: http://localhost:4001'));
})
.catch((err) => console.error('❌ MongoDB 연결 실패:', err));

