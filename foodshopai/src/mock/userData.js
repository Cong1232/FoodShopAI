/**
 * userData.js
 * Mock data người dùng - đóng vai trò "cơ sở dữ liệu giả" cho AuthContext.
 * Buổi 4: chưa có Backend/JWT/MongoDB thật, mọi thao tác đăng nhập/đăng ký
 * đều xử lý tạm thời trên mảng này (chỉ tồn tại trong phiên làm việc hiện tại).
 *
 * Lưu ý: đây là dữ liệu DEMO, mật khẩu lưu dạng chuỗi thường chỉ để mô phỏng,
 * không phản ánh cách lưu mật khẩu an toàn của hệ thống thật (sau này Backend
 * sẽ mã hoá bằng bcrypt).
 */

const userData = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    password: '123456',
    avatar: 'https://placehold.co/160x160/2E7D32/FFFFFF?text=A',
    address: '123 Đường Nguyễn Văn A, Phường Bến Nghé, Quận 1, TP.HCM',
    dob: '1998-05-20',
    gender: 'Nam',
  },
  {
    id: 2,
    fullName: 'Trần Thị Bích',
    email: 'tranthibich@gmail.com',
    phone: '0912345678',
    password: '123456',
    avatar: 'https://placehold.co/160x160/81C784/FFFFFF?text=B',
    address: '45 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
    dob: '2000-11-02',
    gender: 'Nữ',
  },
]

export default userData
