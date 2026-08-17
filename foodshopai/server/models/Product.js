const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục là bắt buộc'],
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá không được âm'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Giá khuyến mãi không được âm'],
    },
    description: {
      type: String,
      required: [true, 'Mô tả là bắt buộc'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Số lượng tồn kho là bắt buộc'],
      min: [0, 'Số lượng không được âm'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    origin: {
      type: String,
      trim: true,
    },
    nutrition: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    isNewProduct: { // Dùng isNewProduct thay vì isNew vì isNew là từ khóa nội bộ của mongoose
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// Tạo Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
