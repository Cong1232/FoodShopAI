const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String, default: '' },
    
    paymentMethod: {
      type: String,
      required: true,
      default: 'COD',
    },
    
    subtotal: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipping', 'Completed', 'Cancelled', 'paid', 'pending'],
      default: 'Pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      default: 'pending'
    }
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
