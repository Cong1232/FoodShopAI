const jwtUtils = require('../utils/jwt');
const User = require('../models/User');

const verifyTokenMiddleware = async (req, res, next) => {
  try {
    let token;
    
    // Kiểm tra header Authorization có tồn tại và bắt đầu bằng Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập, không có quyền truy cập' });
    }

    // Giải mã token
    const decoded = jwtUtils.verifyToken(token);

    // Kiểm tra user có tồn tại không
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'User thuộc về token này không còn tồn tại' });
    }

    if (currentUser.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa. Phiên đăng nhập hết hiệu lực.' });
    }

    // Lưu user vào req để dùng cho các middleware/controller tiếp theo
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền Admin' });
  }
};

module.exports = {
  verifyToken: verifyTokenMiddleware,
  isAdmin,
};
