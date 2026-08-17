const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

// Các route này đã được bảo vệ bởi middleware trong adminRoutes.js
router.get('/', adminUserController.getUsers);
router.get('/:id', adminUserController.getUserById);
router.put('/:id', adminUserController.updateUser);
router.put('/:id/role', adminUserController.updateUserRole);
router.put('/:id/status', adminUserController.updateUserStatus);

module.exports = router;
