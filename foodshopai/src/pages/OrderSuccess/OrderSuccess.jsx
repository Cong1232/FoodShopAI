import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import OrderStatus from '../Orders/components/OrderStatus.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import orderService from '../../services/orderService.js'
import './OrderSuccess.css'

function OrderSuccess() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order && !!orderId)

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrderById(orderId)
          if (res && res.success) {
            setOrder(res.data)
          }
        } catch (error) {
          console.error('Lỗi lấy đơn hàng:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchOrder()
    }
  }, [order, orderId])

  if (loading) {
    return <div className="section-container py-5 text-center">Đang tải dữ liệu đơn hàng...</div>
  }

  // ===== Trường hợp không có dữ liệu đơn hàng (truy cập trực tiếp / load lại trang) =====
  if (!order) {
    return (
      <div className="section-container order-success-page">
        <div className="order-success-card text-center">
          <h2 className="fw-bold mb-3">Không có thông tin đơn hàng</h2>
          <p className="text-muted mb-4">
            Vui lòng đặt hàng để xem trang xác nhận, hoặc kiểm tra lịch sử đơn hàng của bạn.
          </p>
          <div className="order-success-actions">
            <Link to="/my-orders" className="order-success-btn order-success-btn--outline">
              Xem đơn hàng của tôi
            </Link>
            <Link to="/products" className="order-success-btn order-success-btn--primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-container order-success-page">
      <div className="order-success-card text-center">
        <FaCheckCircle className="order-success-icon" />
        <h2 className="order-success-title">Đặt hàng thành công!</h2>
        <p className="order-success-desc">Cảm ơn bạn đã mua sắm tại FoodShopAI. Đơn hàng của bạn đang được xử lý.</p>

        <div className="order-success-info">
          <div className="order-success-info-row">
            <span>Mã đơn hàng</span>
            <strong>#{order._id || order.id}</strong>
          </div>
          <div className="order-success-info-row">
            <span>Ngày đặt</span>
            <strong>{new Date(order.createdAt || order.date).toLocaleDateString('vi-VN')}</strong>
          </div>
          <div className="order-success-info-row">
            <span>Phương thức thanh toán</span>
            <strong>{order.paymentMethod}</strong>
          </div>
          <div className="order-success-info-row">
            <span>Tổng thanh toán</span>
            <strong>{formatCurrency(order.totalPrice || order.total)}</strong>
          </div>
          <div className="order-success-info-row">
            <span>Trạng thái</span>
            <OrderStatus status={order.orderStatus || order.status} />
          </div>
        </div>

        <div className="order-success-actions">
          <Link to="/my-orders" className="order-success-btn order-success-btn--outline">
            Xem lịch sử đơn hàng
          </Link>
          <Link to="/products" className="order-success-btn order-success-btn--primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
