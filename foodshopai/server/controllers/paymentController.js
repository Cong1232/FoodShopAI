const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const Order = require('../models/Order');
const config = require('../config/vnpay');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// Hàm sắp xếp object theo key để tạo chuỗi hash
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj){
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

exports.createPaymentUrl = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({ success: true, data: vnpUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.paymentReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    
    let secretKey = config.vnp_HashSecret;
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];

      const order = await Order.findById(orderId).populate('user', 'email');
      if (order) {
        if (responseCode === '00') {
          // Success
          order.orderStatus = 'paid';
          order.paymentStatus = 'success';
          order.paymentMethod = 'vnpay';
          order.isPaid = true;
          await order.save();

          // Trừ kho khi thanh toán thành công
          const Product = require('../models/Product');
          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.quantity, sold: item.quantity }
            });
          }

          // Send Email
          await sendOrderConfirmationEmail({
            customerName: order.fullName,
            customerEmail: order.user.email,
            orderId: order._id,
            paymentMethod: 'VNPay',
            paymentStatus: 'Đã thanh toán thành công',
            totalAmount: order.totalPrice,
            items: order.orderItems,
            orderDate: order.createdAt
          });

          // Redirect to frontend order success
          return res.redirect('http://localhost:5173/order-success?orderId=' + orderId);
        } else {
          // Failed
          order.orderStatus = 'pending';
          order.paymentStatus = 'failed';
          await order.save();
          return res.redirect('http://localhost:5173/checkout?payment=failed');
        }
      }
    } else {
      return res.status(400).send('Invalid signature');
    }
  } catch (error) {
    return res.status(500).send('Server Error');
  }
};

// ================= MOMO MOCK =================

exports.createMockMomo = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    // Trả về url giả lập
    res.status(200).json({
      success: true,
      data: {
        paymentId: orderId,
        orderId,
        amount,
        paymentUrl: `/mock-payment?paymentId=${orderId}&amount=${amount}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mockMomoSuccess = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const order = await Order.findById(paymentId).populate('user', 'email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentMethod = 'momo';
    order.paymentStatus = 'success';
    order.orderStatus = 'paid';
    order.isPaid = true;
    await order.save();

    // Trừ kho
    const Product = require('../models/Product');
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Send email
    const emailSent = await sendOrderConfirmationEmail({
      customerName: order.fullName,
      customerEmail: order.user.email,
      orderId: order._id,
      paymentMethod: 'MoMo',
      paymentStatus: 'Đã thanh toán thành công',
      totalAmount: order.totalPrice,
      items: order.orderItems,
      orderDate: order.createdAt
    });

    res.status(200).json({ success: true, message: 'Thanh toán thành công', emailSent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mockMomoCancel = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const order = await Order.findById(paymentId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentMethod = 'momo';
    order.paymentStatus = 'failed';
    order.orderStatus = 'Pending';
    await order.save();

    res.status(200).json({ success: true, message: 'Đã huỷ thanh toán' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
