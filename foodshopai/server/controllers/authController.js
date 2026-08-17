const authService = require('../services/authService');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: { user, accessToken: token },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: { user, accessToken: token },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

// GET /auth/profile
const getProfile = async (req, res) => {
  try {
    // req.user được gán từ middleware verifyToken
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User không tồn tại' });
    }
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email' });
    }
    
    await authService.forgotPassword(email);

    res.status(200).json({ 
      success: true, 
      message: 'Nếu Email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu mới' });
    }

    await authService.resetPassword(token, password, confirmPassword);

    res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword
};
