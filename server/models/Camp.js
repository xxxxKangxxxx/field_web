const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  }
});

const campSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, '연도는 필수 입력값입니다.']
  },
  topic: {
    type: String,
    required: [true, '주제는 필수 입력값입니다.']
  },
  posterImage: {
    type: String,
    required: [true, '포스터 이미지는 필수입니다.']
  },
  timeline: [timelineSchema],
  description: {
    type: String,
    required: [true, '캠프 설명은 필수 입력값입니다.']
  },
  location: {
    type: String,
    required: [true, '캠프 장소는 필수 입력값입니다.']
  },
  participants: {
    type: Number,
    required: [true, '참가자 수는 필수 입력값입니다.']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Camp', campSchema);

