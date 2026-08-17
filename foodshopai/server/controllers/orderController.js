const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { orderItems, fullName, phone, address, note, paymentMethod, subtotal, shippingFee, discount, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      fullName,
      phone,
      address,
      note,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      totalPrice
    });

    // 1. Kiểm tra toàn bộ stock trước khi thực hiện
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Sản phẩm ${item.name} chỉ còn ${product ? product.stock : 0} trong kho.` });
      }
    }

    // 2. Lưu Order
    const createdOrder = await order.save();

    // 3. Cập nhật Stock và Sold (Chỉ nếu là COD)
    if (paymentMethod === 'COD') {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }
    }

    // Xóa giỏ hàng
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send Email if COD
    let emailSent = false;
    if (paymentMethod === 'COD') {
      emailSent = await sendOrderConfirmationEmail({
        customerName: fullName,
        customerEmail: req.user.email,
        orderId: createdOrder._id,
        paymentMethod: 'COD',
        paymentStatus: 'Chưa thanh toán (Thanh toán khi nhận hàng)',
        totalAmount: totalPrice,
        items: orderItems,
        orderDate: createdOrder.createdAt
      });
    }

    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công', data: createdOrder, emailSent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    // Check permission
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    
    // Check permission
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
    }

    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn hàng ở trạng thái Pending' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    // Chỉ hoàn lại Stock nếu đơn hàng đã được trừ kho trước đó.
    // Đơn COD luôn bị trừ kho khi tạo.
    // Đơn VNPay/MoMo chỉ bị trừ kho khi đã thanh toán (isPaid = true).
    const shouldRestoreStock = order.paymentMethod === 'COD' || order.isPaid === true;

    if (shouldRestoreStock) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity }
        });
      }
    }

    res.status(200).json({ success: true, message: 'Đã hủy đơn hàng thành công', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
