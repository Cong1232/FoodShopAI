const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { createProductValidation, updateProductValidation } = require('../validations/productValidation');
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Route GET /products
router.get('/', productController.getAllProducts);

// Route GET /products/:id
router.get('/:id', productController.getProductById);

// Route POST /products (Admin only)
router.post('/', verifyToken, isAdmin, upload.array('images', 5), createProductValidation, productController.createProduct);

// Route PUT /products/:id (Admin only)
router.put('/:id', verifyToken, isAdmin, upload.array('images', 5), updateProductValidation, productController.updateProduct);

// Route DELETE /products/:id (Admin only)
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
