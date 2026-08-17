const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Lỗi xác thực dữ liệu',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

const registerValidation = [
  body('fullName').notEmpty().withMessage('Họ tên là bắt buộc'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  validateRequest,
];

const loginValidation = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
  validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
};
