const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    category: {
      type: String, // Trong mock đang dùng string (ví dụ "Rau củ"), có thể đổi thành ObjectId ref Category sau
      required: [true, 'Vui lòng chọn danh mục'],
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá sản phẩm'],
    },
    discountPrice: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    },
    nutrition: {
      type: String,
    },
    origin: {
      type: String,
    },
    weight: {
      type: String,
    },
    stock: {
      type: Number,
      required: [true, 'Vui lòng nhập số lượng tồn kho'],
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    isSale: {
      type: Boolean,
      default: false,
    },
    isNewProduct: { // Tên mock có thể là isNew, dùng isNewProduct tránh trùng keyword
      type: Boolean,
      default: false,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
