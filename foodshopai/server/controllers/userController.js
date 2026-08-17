const userService = require('../services/userService');

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách user thành công',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    res.status(200).json({
      success: true,
      message: 'Lấy chi tiết user thành công',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /users
const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    // Ẩn password trước khi trả về
    newUser.password = undefined;
    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: newUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /users/:id
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user để cập nhật' });
    }
    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user để xóa' });
    }
    res.status(200).json({
      success: true,
      message: 'Xóa user thành công',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
