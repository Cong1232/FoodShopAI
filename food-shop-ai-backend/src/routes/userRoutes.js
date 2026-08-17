const express = require('express');
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.get('/profile', protect, getUserProfile);

router.put('/profile', protect, updateUserProfile);

router.put(
  '/change-password',
  protect,
  [
    body('oldPassword', 'Vui lòng nhập mật khẩu cũ').exists(),
    body('newPassword', 'Mật khẩu mới phải có ít nhất 6 ký tự').isLength({ min: 6 }),
  ],
  validate,
  changePassword
);

module.exports = router;
