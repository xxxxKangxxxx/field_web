const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  season: {
    type: String,
    required: true,
    enum: ['상반기', '하반기']
  },
  schedules: [{
    title: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recruit', recruitSchema);
