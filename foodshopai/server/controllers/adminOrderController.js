const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Lấy danh sách toàn bộ đơn hàng (có search, filter, pagination, sort)
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, sort } = req.query;

    const query = {};

    if (search) {
      // Nếu chuỗi search là ObjectId hợp lệ, tìm theo _id
      if (mongoose.isValidObjectId(search)) {
        query.$or = [
          { _id: search },
          { fullName: { $regex: search, $options: 'i' } }
        ];
      } else {
        // Tìm theo tên khách hàng
        query.fullName = { $regex: search, $options: 'i' };
      }
    }

    if (status) {
      query.orderStatus = status;
    }

    // Sort logic
    let sortObj = { createdAt: -1 };
    if (sort === 'totalPrice_asc') sortObj = { totalPrice: 1 };
    if (sort === 'totalPrice_desc') sortObj = { totalPrice: -1 };
    if (sort === 'createdAt_asc') sortObj = { createdAt: 1 };
    if (sort === 'createdAt_desc') sortObj = { createdAt: -1 };

    const orders = await Order.find(query)
      .populate('user', 'fullName email')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Chi tiết đơn hàng
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email phone avatar')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    const currentStatus = order.orderStatus;
    
    // Nếu đơn đã Hoàn thành hoặc đã Hủy, không cho phép đổi sang trạng thái khác
    if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: `Không thể thay đổi trạng thái của đơn hàng đã ${currentStatus}` 
      });
    }

    // Kiểm tra luồng hợp lệ
    const validTransitions = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Shipping', 'Cancelled'],
      Shipping: ['Completed', 'Cancelled']
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Chuyển trạng thái từ ${currentStatus} sang ${status} không hợp lệ` 
      });
    }

    order.orderStatus = status;

    // Nếu đơn hoàn thành qua COD, cập nhật isPaid
    if (status === 'Completed' && order.paymentMethod === 'COD') {
      order.isPaid = true;
    }

    await order.save();

    // Nếu chuyển sang Hủy, hoàn lại Stock
    if (status === 'Cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = product.stock + item.quantity;
          product.sold = product.sold - item.quantity;
          await product.save();
        }
      }
    }

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus
};
