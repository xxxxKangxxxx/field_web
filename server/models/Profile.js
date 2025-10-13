const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    type: String // 이미지 경로 (예: /uploads/profile1.jpg)
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
