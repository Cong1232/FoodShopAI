const Product = require('../models/Product');
const { successResponse } = require('../utils/apiResponse');

// @desc    Lấy danh sách sản phẩm (có filter, pagination, sort)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Filter
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // Case insensitive
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const priceQuery = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    const ratingQuery = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    const filter = { ...keyword, ...category, ...priceQuery, ...ratingQuery };

    // Sort
    let sortQuery = {};
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') sortQuery = { price: 1 };
      else if (req.query.sort === 'price_desc') sortQuery = { price: -1 };
      else if (req.query.sort === 'newest') sortQuery = { createdAt: -1 };
      else if (req.query.sort === 'top_sales') sortQuery = { sold: -1 };
    } else {
      sortQuery = { createdAt: -1 }; // Mặc định mới nhất
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortQuery)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: products,
      pagination: {
        page,
        limit: pageSize,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      successResponse(res, 200, 'Lấy sản phẩm thành công', product);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    successResponse(res, 201, 'Tạo sản phẩm thành công', createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      successResponse(res, 200, 'Cập nhật sản phẩm thành công', updatedProduct);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      successResponse(res, 200, 'Xóa sản phẩm thành công', null);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy sản phẩm');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
