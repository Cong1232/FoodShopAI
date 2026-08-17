/**
 * orderData.js
 * Mock data lịch sử đơn hàng cho trang Order History.
 * Buổi 4: chưa có Backend, đơn hàng mới đặt (từ Checkout) sẽ KHÔNG được lưu
 * lại vĩnh viễn vào danh sách này (chỉ hiển thị ở trang Order Success),
 * vì dữ liệu ở đây chỉ là dữ liệu tĩnh minh hoạ.
 */

// Cấu hình hiển thị cho từng trạng thái đơn hàng - dùng chung cho OrderStatus
// (tránh hard-code màu sắc/nhãn trực tiếp trong component)
export const orderStatusConfig = {
  Pending: { label: 'Chờ xác nhận', color: '#FF9800' },
  Confirmed: { label: 'Đã xác nhận', color: '#1976D2' },
  Shipping: { label: 'Đang giao', color: '#8E24AA' },
  Completed: { label: 'Hoàn thành', color: '#2E7D32' },
  Cancelled: { label: 'Đã huỷ', color: '#E53935' },
}

const orderData = [
  {
    id: 'FSA00125',
    date: '2026-06-28',
    status: 'Completed',
    total: 458000,
    paymentMethod: 'COD',
    items: [
      { name: 'Thịt ba chỉ heo tươi', quantity: 2, price: 69000 },
      { name: 'Táo Envy nhập khẩu', quantity: 1, price: 89000 },
      { name: 'Cá hồi phi lê Na Uy', quantity: 1, price: 179000 },
    ],
  },
  {
    id: 'FSA00124',
    date: '2026-06-20',
    status: 'Shipping',
    total: 246000,
    paymentMethod: 'Momo',
    items: [
      { name: 'Tôm sú tươi size lớn', quantity: 1, price: 139000 },
      { name: 'Rau cải xanh hữu cơ', quantity: 2, price: 12000 },
      { name: 'Nước cam ép nguyên chất', quantity: 1, price: 49000 },
    ],
  },
  {
    id: 'FSA00123',
    date: '2026-06-15',
    status: 'Confirmed',
    total: 119000,
    paymentMethod: 'VNPay',
    items: [{ name: 'Mì gói cao cấp (Thùng 30 gói)', quantity: 1, price: 119000 }],
  },
  {
    id: 'FSA00122',
    date: '2026-06-10',
    status: 'Pending',
    total: 328000,
    paymentMethod: 'COD',
    items: [
      { name: 'Gạo ST25 thượng hạng', quantity: 1, price: 185000 },
      { name: 'Hạt điều rang muối', quantity: 1, price: 105000 },
      { name: 'Nước dừa tươi đóng chai', quantity: 1, price: 25000 },
    ],
  },
  {
    id: 'FSA00121',
    date: '2026-05-30',
    status: 'Cancelled',
    total: 89000,
    paymentMethod: 'Momo',
    items: [{ name: 'Cà phê rang xay nguyên chất', quantity: 1, price: 89000 }],
  },
]

export default orderData
