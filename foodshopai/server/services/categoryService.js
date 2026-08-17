const Category = require('../models/Category');

/**
 * Lấy danh sách tất cả danh mục (không bao gồm danh mục đã xóa mềm)
 */
const getAllCategories = async () => {
  return await Category.find({ isDeleted: { $ne: true }, status: 'active' });
};

/**
 * Lấy chi tiết 1 danh mục theo ID (không bao gồm danh mục đã xóa mềm)
 */
const getCategoryById = async (id) => {
  return await Category.findOne({ _id: id, isDeleted: { $ne: true }, status: 'active' });
};

/**
 * Tạo danh mục mới
 */
const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

/**
 * Cập nhật danh mục theo ID
 */
const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true, // Trả về document sau khi update
    runValidators: true, // Chạy validation trong model
  });
};

/**
 * Xóa danh mục theo ID
 */
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
