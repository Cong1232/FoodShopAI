const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName', 'Vui lòng nhập họ tên').not().isEmpty(),
    body('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    body('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    body('password', 'Vui lòng nhập mật khẩu').exists(),
  ],
  validate,
  loginUser
);

router.get('/me', protect, getMe);

module.exports = router;
