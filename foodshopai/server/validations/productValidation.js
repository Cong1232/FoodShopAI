const { body, validationResult } = require('express-validator');

// Validation middleware xử lý kết quả trả về
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

const createProductValidation = [
  body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
  body('slug').notEmpty().withMessage('Slug là bắt buộc'),
  body('category').notEmpty().withMessage('Danh mục là bắt buộc'),
  body('price').isNumeric().withMessage('Giá sản phẩm phải là số').custom(value => value >= 0).withMessage('Giá không được âm'),
  body('stock').isNumeric().withMessage('Số lượng tồn kho phải là số').custom(value => value >= 0).withMessage('Số lượng không được âm'),
  body('description').notEmpty().withMessage('Mô tả là bắt buộc'),
  validateRequest,
];

const updateProductValidation = [
  body('price').optional().isNumeric().withMessage('Giá sản phẩm phải là số').custom(value => value >= 0).withMessage('Giá không được âm'),
  body('stock').optional().isNumeric().withMessage('Số lượng tồn kho phải là số').custom(value => value >= 0).withMessage('Số lượng không được âm'),
  validateRequest,
];

module.exports = {
  createProductValidation,
  updateProductValidation,
};
