const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategoryController');
const upload = require('../middlewares/uploadMiddleware');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken, isAdmin);

router.get('/', adminCategoryController.getCategories);
router.get('/:id', adminCategoryController.getCategoryById);
router.post('/', upload.single('image'), adminCategoryController.createCategory);
router.put('/:id', upload.single('image'), adminCategoryController.updateCategory);
router.delete('/:id', adminCategoryController.deleteCategory);

module.exports = router;
