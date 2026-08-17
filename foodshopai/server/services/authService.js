const User = require('../models/User');
const jwtUtils = require('../utils/jwt');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendResetPasswordEmail } = require('./emailService');

/**
 * Đăng ký tài khoản
 */
const register = async (userData) => {
  // Tạo user (password sẽ được hash tự động nhờ pre-save hook)
  const user = new User(userData);
  await user.save();

  // Tạo token
  const token = jwtUtils.generateToken({ id: user._id });

  // Ẩn password
  user.password = undefined;

  return { user, token };
};

/**
 * Đăng nhập
 */
const login = async (email, password) => {
  // Tìm user qua email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // So sánh password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Kiểm tra trạng thái bị khóa
  if (user.status === 'banned') {
    throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
  }

  // Tạo token
  const token = jwtUtils.generateToken({ id: user._id });

  // Ẩn password
  user.password = undefined;

  return { user, token };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  // Luôn thành công dù email không tồn tại để bảo mật
  if (!user) {
    return true;
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phut

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  await sendResetPasswordEmail({
    customerName: user.fullName,
    customerEmail: user.email,
    resetUrl
  });

  return true;
};

const resetPassword = async (resetToken, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải từ 6 ký tự trở lên');
  }

  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new Error('Liên kết đã hết hạn, vui lòng yêu cầu lại.');
  }

  // Update password (will trigger pre-save hash)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return true;
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};
