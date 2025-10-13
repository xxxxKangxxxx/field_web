// server/models/Users.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수 입력 항목입니다.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '올바른 이메일 형식이 아닙니다.'],
    sparse: true // null 값을 허용하지 않고 unique 인덱스 생성
  },
  name: {
    type: String,
    required: [true, '이름은 필수 입력 항목입니다.'],
    trim: true
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수 입력 항목입니다.'],
    minlength: [4, '비밀번호는 최소 4자 이상이어야 합니다.']
  },
  department: {
    type: String,
    required: [true, '소속은 필수 입력 항목입니다.'],
    enum: {
      values: ['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'],
      message: '유효하지 않은 소속입니다.'
    }
  },
  position: {
    type: String,
    required: [true, '직책은 필수 입력 항목입니다.'],
    enum: {
      values: ['대외협력부장', '단장', '부단장', '기획부장', '컴페티션부장', '홍보부장', '부원'],
      message: '유효하지 않은 직책입니다.'
    }
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  activeToken: {
    type: String,
    default: null
  }
}, { 
  timestamps: true 
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

mongoose.connection.on('connected', async () => {
  try {
    // 먼저 null 이메일을 가진 문서들을 찾아서 삭제
    const User = mongoose.model('User', userSchema);
    await User.deleteMany({ email: null });
    console.log('null 이메일을 가진 문서들이 삭제되었습니다.');

    // 이메일 인덱스 확인 및 생성
    const collection = mongoose.connection.collection('users');
    const indexes = await collection.indexes();
    const hasEmailIndex = indexes.some(index => index.key.email);
    
    if (!hasEmailIndex) {
      await collection.createIndex(
        { email: 1 }, 
        { 
          unique: true, 
          sparse: true,
          background: true 
        }
      );
      console.log('이메일 인덱스가 생성되었습니다.');
    }
  } catch (err) {
    console.log('인덱스 확인/생성 중 에러:', err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
