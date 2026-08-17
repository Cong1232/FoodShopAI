const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Tất cả route admin cần đăng nhập và role = admin
router.use(verifyToken, isAdmin);

const adminCategoryRoutes = require('./adminCategoryRoutes');
const adminOrderRoutes = require('./adminOrderRoutes');
const adminUserRoutes = require('./adminUserRoutes');

// Route GET /api/admin/dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/dashboard/charts', adminController.getDashboardCharts);

// Route /api/admin/categories
router.use('/categories', adminCategoryRoutes);

// Route /api/admin/orders
router.use('/orders', adminOrderRoutes);

// Route /api/admin/users
router.use('/users', adminUserRoutes);

// Route /api/admin/reviews
const adminReviewRoutes = require('./adminReviewRoutes');
router.use('/reviews', adminReviewRoutes);

// Route /api/admin/reports
const adminReportRoutes = require('./adminReportRoutes');
router.use('/reports', adminReportRoutes);

module.exports = router;
