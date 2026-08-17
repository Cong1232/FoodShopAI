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

const createReviewValidation = [
  body('user').notEmpty().withMessage('User ID là bắt buộc'),
  body('product').notEmpty().withMessage('Product ID là bắt buộc'),
  body('rating').isNumeric().withMessage('Rating phải là số').isInt({ min: 1, max: 5 }).withMessage('Rating từ 1 đến 5'),
  body('comment').notEmpty().withMessage('Nội dung đánh giá là bắt buộc'),
  validateRequest,
];

const updateReviewValidation = [
  body('rating').optional().isNumeric().withMessage('Rating phải là số').isInt({ min: 1, max: 5 }).withMessage('Rating từ 1 đến 5'),
  body('comment').optional().notEmpty().withMessage('Nội dung đánh giá là bắt buộc'),
  validateRequest,
];

module.exports = {
  createReviewValidation,
  updateReviewValidation,
};
