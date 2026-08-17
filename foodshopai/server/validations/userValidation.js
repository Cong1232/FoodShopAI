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

const createUserValidation = [
  body('fullName').notEmpty().withMessage('Họ tên là bắt buộc'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  body('role').optional().isIn(['customer', 'admin']).withMessage('Role không hợp lệ'),
  body('status').optional().isIn(['active', 'inactive', 'banned']).withMessage('Status không hợp lệ'),
  validateRequest,
];

const updateUserValidation = [
  body('email').optional().isEmail().withMessage('Email không hợp lệ'),
  body('role').optional().isIn(['customer', 'admin']).withMessage('Role không hợp lệ'),
  body('status').optional().isIn(['active', 'inactive', 'banned']).withMessage('Status không hợp lệ'),
  validateRequest,
];

module.exports = {
  createUserValidation,
  updateUserValidation,
};
