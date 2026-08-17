// Load các biến môi trường từ file .env
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Kết nối với MongoDB
connectDB();

// Thiết lập cổng chạy server
const PORT = process.env.PORT || 5000;

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
