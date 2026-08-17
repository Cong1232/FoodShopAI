const dotenv = require('dotenv');
// Load biến môi trường
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Kết nối database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
