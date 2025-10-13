const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['monthly', 'career', 'notice'],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
