const mongoose = require('mongoose');

/**
 * Hàm kết nối Database MongoDB sử dụng Mongoose
 * Đảm bảo đọc MONGO_URI từ biến môi trường
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
