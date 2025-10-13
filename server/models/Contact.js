const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
