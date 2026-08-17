require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Trái cây', slug: 'trai-cay', image: '/images/categories/trai-cay.jpg', description: 'Trái cây tươi ngon', status: 'active' },
  { name: 'Rau củ', slug: 'rau-cu', image: '/images/categories/rau-cu.jpg', description: 'Rau củ sạch', status: 'active' },
  { name: 'Thịt', slug: 'thit', image: '/images/categories/thit.jpg', description: 'Thịt tươi sống', status: 'active' },
  { name: 'Hải sản', slug: 'hai-san', image: '/images/categories/hai-san.jpg', description: 'Hải sản tươi sống', status: 'active' },
  { name: 'Đồ uống', slug: 'do-uong', image: '/images/categories/do-uong.jpg', description: 'Đồ uống giải khát', status: 'active' },
  { name: 'Thực phẩm khô', slug: 'thuc-pham-kho', image: '/images/categories/thuc-pham-kho.jpg', description: 'Thực phẩm đóng gói khô', status: 'active' }
];

const seedCategories = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding Categories');

    // Xóa toàn bộ Category cũ
    await Category.deleteMany({});
    console.log('Old Categories deleted');

    // Thêm các Category mới
    await Category.insertMany(categories);
    console.log('Categories Seeded Successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
