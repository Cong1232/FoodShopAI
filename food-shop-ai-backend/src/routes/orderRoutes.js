const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.route('/')
  .post(
    protect,
    [
      body('items', 'Giỏ hàng không được để trống').isArray({ min: 1 }),
      body('customerInfo.fullName', 'Vui lòng nhập tên người nhận').not().isEmpty(),
      body('customerInfo.phone', 'Vui lòng nhập số điện thoại').not().isEmpty(),
      body('customerInfo.address', 'Vui lòng nhập địa chỉ').not().isEmpty(),
    ],
    validate,
    createOrder
  );

router.route('/my-orders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
