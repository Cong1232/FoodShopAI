const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');

// Không cần verifyToken, isAdmin ở đây vì đã được bọc ở adminRoutes.js
router.get('/', adminOrderController.getOrders);
router.get('/:id', adminOrderController.getOrderById);
router.put('/:id/status', adminOrderController.updateOrderStatus);

module.exports = router;
