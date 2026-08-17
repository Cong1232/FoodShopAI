const adminCategoryService = require('../services/adminCategoryService');
const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const result = await adminCategoryService.getCategories(req.query);
    res.status(200).json({
      success: true,
      data: result.categories,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await adminCategoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Kiểm tra trùng slug
    if (data.slug) {
      const existing = await Category.findOne({ slug: data.slug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Slug đã tồn tại, vui lòng chọn tên khác' });
      }
    }

    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`; // Dùng chung thư mục upload hoặc tự chuyển path
    }

    const newCategory = await adminCategoryService.createCategory(data);
    res.status(201).json({ success: true, message: 'Tạo danh mục thành công', data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    // Kiểm tra trùng slug (nếu đổi slug)
    if (data.slug) {
      const existing = await Category.findOne({ slug: data.slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Slug đã tồn tại, vui lòng chọn tên khác' });
      }
    }

    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
    }

    const updated = await adminCategoryService.updateCategory(req.params.id, data);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });

    res.status(200).json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await adminCategoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message }); // Bắt lỗi ràng buộc Product
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
