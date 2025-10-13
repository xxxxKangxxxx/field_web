const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);  // 관리자용

module.exports = router;
