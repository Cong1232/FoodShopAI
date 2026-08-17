const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');

const { verifyToken } = require('../middlewares/authMiddleware');

// Route POST /auth/register
router.post('/register', registerValidation, authController.register);

// Route POST /auth/login
router.post('/login', loginValidation, authController.login);

// Route GET /auth/profile
router.get('/profile', verifyToken, authController.getProfile);

// Route POST /auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Route POST /auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
