const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public route: Lấy review của 1 sản phẩm
router.get('/product/:productId', reviewController.getReviewsByProduct);

// Cần đăng nhập cho các route dưới đây
router.use(verifyToken);

// Lấy danh sách review của tôi
router.get('/my', reviewController.getMyReviews);

// Tạo mới
router.post('/', reviewController.createReview);

// Cập nhật
router.put('/:id', reviewController.updateReview);

// Xóa
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
