const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, title, type, content } = req.body;
    const newContact = new Contact({ name, email, phone, title, type, content });
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: '문의 저장 실패', error: err });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: '문의 목록 조회 실패', error: err });
  }
};
