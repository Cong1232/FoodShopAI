const Order = require('../models/Order');

/**
 * Lấy danh sách tất cả đơn hàng
 */
const getAllOrders = async () => {
  return await Order.find({})
    .populate('user', 'fullName email phone')
    .populate('products.product', 'name images');
};

/**
 * Lấy chi tiết 1 đơn hàng theo ID
 */
const getOrderById = async (id) => {
  return await Order.findById(id)
    .populate('user', 'fullName email phone')
    .populate('products.product', 'name images');
};

/**
 * Tạo đơn hàng mới
 */
const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

/**
 * Cập nhật đơn hàng theo ID (thường dùng để cập nhật status)
 */
const updateOrder = async (id, updateData) => {
  return await Order.findByIdAndUpdate(id, updateData, {
    new: true, // Trả về document sau khi update
    runValidators: true,
  });
};

/**
 * Xóa đơn hàng theo ID
 */
const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
