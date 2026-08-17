const jwt = require('jsonwebtoken');

// Thay vì set cứng trong code, nên đọc từ process.env.JWT_SECRET (cần bổ sung vào file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_if_env_missing';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hàm tạo JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Hàm verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
