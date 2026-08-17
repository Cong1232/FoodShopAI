const Category = require('../models/Category');
const { successResponse } = require('../utils/apiResponse');

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    successResponse(res, 200, 'Lấy danh sách danh mục thành công', categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, icon, slug } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.status(400);
      throw new Error('Danh mục đã tồn tại');
    }

    const category = await Category.create({
      name,
      icon,
      slug,
    });

    successResponse(res, 201, 'Tạo danh mục thành công', category);
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = req.body.name || category.name;
      category.icon = req.body.icon !== undefined ? req.body.icon : category.icon;
      category.slug = req.body.slug || category.slug;

      const updatedCategory = await category.save();
      successResponse(res, 200, 'Cập nhật danh mục thành công', updatedCategory);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy danh mục');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.deleteOne({ _id: category._id });
      successResponse(res, 200, 'Xóa danh mục thành công', null);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy danh mục');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
