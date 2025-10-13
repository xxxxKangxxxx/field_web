// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, name, department, position } = req.body;
    
    // 필수 필드 검증
    if (!email || !password || !name || !department || !position) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    const user = new User({ 
      email, 
      password,
      name,
      department, 
      position,
      isAdmin: position.includes('부장') || position === '단장' || position === '부단장'
    });

    await user.save();

    res.status(201).json({ 
      message: '회원가입이 완료되었습니다.', 
      user: { 
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: user.isAdmin 
      } 
    });
  } catch (err) {
    console.error('회원가입 에러:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    
    res.status(500).json({ message: '회원가입 처리 중 오류가 발생했습니다.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ message: '등록되지 않은 이메일입니다.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 이미 로그인된 사용자인지 확인
    if (user.activeToken) {
      // 기존 토큰이 유효한지 확인
      try {
        jwt.verify(user.activeToken, process.env.JWT_SECRET);
        return res.status(400).json({ 
          message: '이미 다른 기기에서 로그인되어 있습니다. 먼저 로그아웃해주세요.' 
        });
      } catch (err) {
        // 토큰이 만료되었다면 계속 진행
        console.log('기존 토큰 만료됨');
      }
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: user.isAdmin 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // 새 토큰을 저장
    user.activeToken = token;
    await user.save();

    res.status(200).json({ 
      message: '로그인 성공', 
      token,
      user: {
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ message: '로그인 실패', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // activeToken 제거
    user.activeToken = null;
    await user.save();

    res.status(200).json({ message: '로그아웃 되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '로그아웃 실패', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 토큰 유효성 검사
    if (user.activeToken !== req.headers.authorization?.split(' ')[1]) {
      return res.status(401).json({ 
        message: '다른 기기에서 로그인되어 현재 세션이 만료되었습니다.' 
      });
    }

    res.status(200).json({
      email: user.email,
      name: user.name,
      department: user.department,
      position: user.position,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    res.status(500).json({ message: '사용자 정보 조회 실패', error: err.message });
  }
};