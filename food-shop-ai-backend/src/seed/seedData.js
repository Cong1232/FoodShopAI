const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Dữ liệu cũ đã được xóa!');

    // Hash password cho users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    // Tạo users
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@foodshop.ai',
        password: passwordHash,
        role: 'admin',
        phone: '0987654321',
      },
      {
        fullName: 'Khách Hàng',
        email: 'customer@foodshop.ai',
        password: passwordHash,
        role: 'customer',
        phone: '0123456789',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Đã tạo Users thành công!');

    // Tạo danh mục
    const categories = [
      { name: 'Rau củ', slug: 'rau-cu', icon: 'fa-solid fa-carrot' },
      { name: 'Trái cây', slug: 'trai-cay', icon: 'fa-solid fa-apple-whole' },
      { name: 'Thịt, cá, trứng', slug: 'thit-ca-trung', icon: 'fa-solid fa-drumstick-bite' },
      { name: 'Đồ uống', slug: 'do-uong', icon: 'fa-solid fa-wine-bottle' },
      { name: 'Bánh kẹo', slug: 'banh-keo', icon: 'fa-solid fa-cookie' },
      { name: 'Gia vị', slug: 'gia-vi', icon: 'fa-solid fa-pepper-hot' },
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Đã tạo Categories thành công!');

    // Lấy id danh mục để assign cho sản phẩm
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat.name; // Trong Product model đang dùng string cho category
    });

    // Tạo sản phẩm
    const products = [
      {
        name: 'Cam sành loại 1 (1kg)',
        category: categoryMap['Trái cây'],
        price: 35000,
        discountPrice: 25000,
        rating: 4.5,
        sold: 150,
        description: 'Cam sành mọng nước, ngọt lịm, rất tốt cho sức khỏe.',
        stock: 50,
        images: ['https://via.placeholder.com/300?text=Cam+Sanh'],
        isSale: true,
        isNewProduct: false,
        isHot: true,
      },
      {
        name: 'Thịt bò tươi ngon (500g)',
        category: categoryMap['Thịt, cá, trứng'],
        price: 150000,
        rating: 5,
        sold: 80,
        description: 'Thịt bò tươi mềm, đảm bảo vệ sinh an toàn thực phẩm.',
        stock: 20,
        images: ['https://via.placeholder.com/300?text=Thit+Bo'],
        isSale: false,
        isNewProduct: true,
        isHot: false,
      },
      {
        name: 'Cải ngọt mớ (500g)',
        category: categoryMap['Rau củ'],
        price: 15000,
        rating: 4.2,
        sold: 300,
        description: 'Cải ngọt trồng theo phương pháp hữu cơ an toàn.',
        stock: 100,
        images: ['https://via.placeholder.com/300?text=Cai+Ngot'],
        isSale: false,
        isNewProduct: false,
        isHot: false,
      },
      {
        name: 'Nước mắm Nam Ngư (Chai 500ml)',
        category: categoryMap['Gia vị'],
        price: 45000,
        rating: 4.8,
        sold: 500,
        description: 'Nước mắm đậm đà hương vị truyền thống.',
        stock: 200,
        images: ['https://via.placeholder.com/300?text=Nuoc+Mam'],
        isSale: false,
        isNewProduct: false,
        isHot: true,
      },
      {
        name: 'Bánh quy bơ Danisa (Hộp 454g)',
        category: categoryMap['Bánh kẹo'],
        price: 135000,
        discountPrice: 120000,
        rating: 4.9,
        sold: 120,
        description: 'Bánh quy bơ cao cấp nhập khẩu.',
        stock: 30,
        images: ['https://via.placeholder.com/300?text=Danisa'],
        isSale: true,
        isNewProduct: false,
        isHot: false,
      },
    ];

    await Product.insertMany(products);
    console.log('Đã tạo Products thành công!');

    console.log('Nhập dữ liệu mẫu thành công!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi import data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
