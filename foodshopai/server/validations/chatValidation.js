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

const chatValidation = [
  body('user').notEmpty().withMessage('User ID là bắt buộc'),
  body('question').notEmpty().withMessage('Câu hỏi không được rỗng'),
  validateRequest,
];

module.exports = {
  chatValidation,
};
