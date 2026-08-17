const categoryService = require('../services/categoryService');

// GET /categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách danh mục thành công',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /categories/:id
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    res.status(200).json({
      success: true,
      message: 'Lấy chi tiết danh mục thành công',
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /categories
const createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: newCategory,
    });
  } catch (error) {
    if (error.code === 11000) { // Lỗi trùng unique key trong mongodb
      return res.status(400).json({ success: false, message: 'Tên danh mục hoặc slug đã tồn tại' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /categories/:id
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để cập nhật' });
    }
    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Tên danh mục hoặc slug đã tồn tại' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /categories/:id
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để xóa' });
    }
    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
