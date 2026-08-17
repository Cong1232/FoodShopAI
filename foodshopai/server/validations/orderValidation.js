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

const createOrderValidation = [
  body('user').notEmpty().withMessage('User ID là bắt buộc'),
  body('products').isArray({ min: 1 }).withMessage('Giỏ hàng không được rỗng'),
  body('products.*.product').notEmpty().withMessage('Product ID là bắt buộc'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Số lượng phải từ 1 trở lên'),
  body('products.*.price').isNumeric().withMessage('Giá sản phẩm không hợp lệ'),
  body('shippingAddress').notEmpty().withMessage('Địa chỉ giao hàng là bắt buộc'),
  body('paymentMethod').notEmpty().withMessage('Phương thức thanh toán là bắt buộc'),
  body('totalPrice').isNumeric().withMessage('Tổng tiền không hợp lệ'),
  validateRequest,
];

const updateOrderValidation = [
  body('status')
    .optional()
    .isIn(['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled'])
    .withMessage('Status không hợp lệ'),
  validateRequest,
];

module.exports = {
  createOrderValidation,
  updateOrderValidation,
};
