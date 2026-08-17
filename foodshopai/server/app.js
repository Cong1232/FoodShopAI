const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Khởi tạo Express app
const app = express();

// ===== MIDDLEWARES =====
// Cấu hình security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
// Nén response để tối ưu tốc độ mạng
app.use(compression());
// Bật CORS cho phép frontend gọi API
app.use(cors());
// Parse JSON body
app.use(express.json());
// Parse urlencoded body
app.use(express.urlencoded({ extended: true }));
// Parse cookie
app.use(cookieParser());

// Log request trong môi trường dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Cấu hình thư mục tĩnh cho uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ROUTES =====
// Route test (Health Check)
app.get('/', (req, res) => {
  res.json({
    message: 'FoodShop API Running...'
  });
});

// Các API// Đăng ký routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cart', cartRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

module.exports = app;
