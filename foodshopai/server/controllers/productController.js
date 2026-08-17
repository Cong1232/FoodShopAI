const productService = require('../services/productService');

// GET /products
const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: result.products,
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

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json({
      success: true,
      message: 'Lấy chi tiết sản phẩm thành công',
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /products
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Xử lý ảnh nếu có upload
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.images = imagePaths;
    }

    const newProduct = await productService.createProduct(productData);
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Xử lý ảnh nếu có upload thêm
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      // Lấy ảnh cũ nếu user gửi lên mảng ảnh cũ giữ lại
      const existingImages = req.body.existingImages ? (Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages]) : [];
      updateData.images = [...existingImages, ...newImages];
    } else if (req.body.existingImages) {
      updateData.images = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
    }

    const updatedProduct = await productService.updateProduct(req.params.id, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để cập nhật' });
    }
    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
