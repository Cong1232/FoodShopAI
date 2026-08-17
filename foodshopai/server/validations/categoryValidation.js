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

const createCategoryValidation = [
  body('name').notEmpty().withMessage('Tên danh mục là bắt buộc'),
  body('slug').notEmpty().withMessage('Slug là bắt buộc'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status phải là active hoặc inactive'),
  validateRequest,
];

const updateCategoryValidation = [
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status phải là active hoặc inactive'),
  validateRequest,
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
