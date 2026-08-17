const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidation, updateUserValidation } = require('../validations/userValidation');

// Route GET /users
router.get('/', userController.getAllUsers);

// Route GET /users/:id
router.get('/:id', userController.getUserById);

// Route POST /users
router.post('/', createUserValidation, userController.createUser);

// Route PUT /users/:id
router.put('/:id', updateUserValidation, userController.updateUser);

// Route DELETE /users/:id
router.delete('/:id', userController.deleteUser);

module.exports = router;
