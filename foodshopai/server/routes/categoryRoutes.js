const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { createCategoryValidation, updateCategoryValidation } = require('../validations/categoryValidation');

// Route GET /categories
router.get('/', categoryController.getAllCategories);

// Route GET /categories/:id
router.get('/:id', categoryController.getCategoryById);

// Route POST /categories
router.post('/', createCategoryValidation, categoryController.createCategory);

// Route PUT /categories/:id
router.put('/:id', updateCategoryValidation, categoryController.updateCategory);

// Route DELETE /categories/:id
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
