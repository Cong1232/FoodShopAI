const User = require('../models/User');

// Lấy danh sách toàn bộ người dùng (có search, filter, pagination, sort)
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, role, status, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    // Sort logic
    let sortObj = { createdAt: -1 };
    if (sort === 'createdAt_asc') sortObj = { createdAt: 1 };
    if (sort === 'name_asc') sortObj = { fullName: 1 };
    if (sort === 'name_desc') sortObj = { fullName: -1 };

    const users = await User.find(query)
      .select('-password') // Không trả về password
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết người dùng
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const { fullName, phone, address, avatar } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật thông tin (không cập nhật email, role, status ở đây)
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    user.password = undefined; // Ẩn password trước khi trả về
    res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật quyền (Role)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Quyền không hợp lệ' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra Admin tự hạ quyền
    if (req.user._id.toString() === targetUser._id.toString() && role === 'user') {
      return res.status(403).json({ success: false, message: 'Bạn không thể tự hạ quyền Admin của chính mình' });
    }

    targetUser.role = role;
    await targetUser.save();

    targetUser.password = undefined;
    res.status(200).json({ success: true, message: `Đã thay đổi quyền thành ${role.toUpperCase()}`, data: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'banned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra Admin tự khóa hoặc đổi trạng thái
    if (req.user._id.toString() === targetUser._id.toString() && status !== 'active') {
      return res.status(403).json({ success: false, message: 'Bạn không thể thay đổi trạng thái tài khoản của chính mình' });
    }

    targetUser.status = status;
    await targetUser.save();

    targetUser.password = undefined;
    res.status(200).json({ success: true, message: `Đã đổi trạng thái thành ${status}`, data: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  updateUserStatus
};
