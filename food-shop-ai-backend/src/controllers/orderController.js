const Order = require('../models/Order');
const { successResponse } = require('../utils/apiResponse');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      customerInfo,
      paymentMethod,
      subtotal,
      discountAmount,
      shippingFee,
      total,
    } = req.body;

    if (items && items.length === 0) {
      res.status(400);
      throw new Error('Không có sản phẩm trong đơn hàng');
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        customerInfo,
        paymentMethod,
        subtotal,
        discountAmount,
        shippingFee,
        total,
      });

      const createdOrder = await order.save();
      successResponse(res, 201, 'Tạo đơn hàng thành công', createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách đơn hàng của user đang đăng nhập
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, 200, 'Lấy danh sách đơn hàng thành công', orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy chi tiết 1 đơn hàng (chủ đơn hoặc admin)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email');

    if (order) {
      // Chỉ cho phép admin hoặc chủ của đơn hàng mới được xem
      if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
        successResponse(res, 200, 'Lấy chi tiết đơn hàng thành công', order);
      } else {
        res.status(403);
        throw new Error('Không có quyền truy cập đơn hàng này');
      }
    } else {
      res.status(404);
      throw new Error('Không tìm thấy đơn hàng');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật trạng thái đơn hàng (chỉ admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      successResponse(res, 200, 'Cập nhật trạng thái đơn hàng thành công', updatedOrder);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy đơn hàng');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
