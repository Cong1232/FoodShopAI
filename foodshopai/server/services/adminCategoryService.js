const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * Lấy danh sách category (phân trang, filter)
 */
const getCategories = async (query) => {
  const { keyword, status, sort, page = 1, limit = 10 } = query;
  let filter = { isDeleted: { $ne: true } };

  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }

  if (status) {
    filter.status = status;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'name_asc') sortOption = { name: 1 };
  if (sort === 'name_desc') sortOption = { name: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  // Dùng aggregate để lấy count product cho từng category
  // Hoặc dùng find cơ bản rồi đếm tay (vì aggregation hơi dài dòng).
  // Đơn giản nhất là lấy danh sách category trước, sau đó đếm số lượng product cho mỗi cái.
  const categories = await Category.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Đếm product cho mỗi category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ 
        category: cat._id, 
        isDeleted: { $ne: true } 
      });
      return { ...cat, productCount };
    })
  );

  const total = await Category.countDocuments(filter);

  return {
    categories: categoriesWithCount,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  };
};

/**
 * Lấy chi tiết 1 category
 */
const getCategoryById = async (id) => {
  return await Category.findOne({ _id: id, isDeleted: { $ne: true } });
};

/**
 * Tạo mới category
 */
const createCategory = async (data) => {
  const category = new Category(data);
  return await category.save();
};

/**
 * Cập nhật category
 */
const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Xóa mềm category (chỉ nếu không có product nào)
 */
const deleteCategory = async (id) => {
  // Check products
  const productCount = await Product.countDocuments({ 
    category: id, 
    isDeleted: { $ne: true } 
  });

  if (productCount > 0) {
    throw new Error('Không thể xóa danh mục đang có sản phẩm');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Không tìm thấy danh mục');
  }

  const timestamp = Date.now();
  return await Category.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedAt: new Date(),
    name: `${category.name}_deleted_${timestamp}`,
    slug: `${category.slug}-deleted-${timestamp}`
  }, { new: true });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
