const User = require('../models/User');

/**
 * Lấy danh sách tất cả user
 */
const getAllUsers = async () => {
  return await User.find({}).select('-password'); // Không trả về password
};

/**
 * Lấy chi tiết 1 user theo ID
 */
const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

/**
 * Tạo user mới (CRUD cơ bản, chưa phải Register)
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Cập nhật user theo ID
 */
const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');
};

/**
 * Xóa user theo ID
 */
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
