const User = require('../models/User');
const { successResponse } = require('../utils/apiResponse');

// @desc    Lấy profile user
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      successResponse(res, 200, 'Lấy profile thành công', user);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy user');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật profile user
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.avatar = req.body.avatar || user.avatar;
      user.dob = req.body.dob || user.dob;
      user.gender = req.body.gender || user.gender;

      const updatedUser = await user.save();

      successResponse(res, 200, 'Cập nhật profile thành công', updatedUser);
    } else {
      res.status(404);
      throw new Error('Không tìm thấy user');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(req.body.oldPassword))) {
      user.password = req.body.newPassword;
      await user.save();
      successResponse(res, 200, 'Đổi mật khẩu thành công', null);
    } else {
      res.status(401);
      throw new Error('Mật khẩu cũ không đúng');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
