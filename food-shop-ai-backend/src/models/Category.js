const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên danh mục'],
      unique: true,
      trim: true,
    },
    icon: {
      type: String, // Class icon ví dụ 'fa-solid fa-apple-whole' hoặc URL ảnh
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
