import PropTypes from 'prop-types'
import './OrderStatus.css'

/**
 * Chuyển mã màu HEX (#RRGGBB) sang chuỗi rgba() với độ mờ tuỳ chỉnh.
 * Dùng để tạo nền nhạt cho badge mà không cần CSS color-mix() (tương thích
 * trình duyệt tốt hơn cho phạm vi đồ án).
 */
function hexToRgba(hex, alpha) {
  const parsed = hex.replace('#', '')
  const r = parseInt(parsed.substring(0, 2), 16)
  const g = parseInt(parsed.substring(2, 4), 16)
  const b = parseInt(parsed.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * OrderStatus - Badge hiển thị trạng thái đơn hàng (màu sắc + nhãn tiếng Việt).
 * Cấu hình màu/nhãn lấy từ mock/orderData.js (orderStatusConfig) để tránh
 * hard-code trực tiếp trong component - dùng chung cho OrderCard và OrderSuccess.
 *
 * Props:
 * - status: 1 trong 5 giá trị 'Pending' | 'Confirmed' | 'Shipping' | 'Completed' | 'Cancelled'
 */
const orderStatusConfig = {
  Pending: { label: 'Chờ xác nhận', color: '#FF9800' },
  Confirmed: { label: 'Đã xác nhận', color: '#1976D2' },
  Shipping: { label: 'Đang giao', color: '#8E24AA' },
  Completed: { label: 'Hoàn thành', color: '#2E7D32' },
  Cancelled: { label: 'Đã huỷ', color: '#E53935' },
}

function OrderStatus({ status }) {
  const config = orderStatusConfig[status] || { label: status, color: '#6c757d' }

  return (
    <span
      className="order-status-badge"
      style={{
        color: config.color,
        backgroundColor: hexToRgba(config.color, 0.12),
        borderColor: hexToRgba(config.color, 0.35),
      }}
    >
      {config.label}
    </span>
  )
}

OrderStatus.propTypes = {
  status: PropTypes.string.isRequired,
}

export default OrderStatus
