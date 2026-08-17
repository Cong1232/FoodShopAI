const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting: Tối đa 10 request mỗi phút cho mỗi IP
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,
  message: { success: false, message: 'Bạn gửi tin nhắn quá nhanh, vui lòng thử lại sau.' }
});

// Validation
const chatValidation = [
  body('message').notEmpty().withMessage('Tin nhắn không được để trống')
                 .isString().withMessage('Tin nhắn phải là chuỗi')
                 .trim()
                 .isLength({ max: 500 }).withMessage('Tin nhắn quá dài (tối đa 500 ký tự)')
];

// Route POST /api/chat
router.post('/', chatLimiter, chatValidation, chatController.createChat);

module.exports = router;
