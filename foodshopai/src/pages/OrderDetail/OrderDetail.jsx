import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import PagePlaceholder from '../../components/common/PagePlaceholder.jsx'
import OrderStatus from '../Orders/components/OrderStatus.jsx'
import orderService from '../../services/orderService.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { showToast } from '../../utils/toast.js'
import './OrderDetail.css'

function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const res = await orderService.getOrderById(id)
      if (res && res.success) {
        setOrder(res.data)
      } else {
        setError('Không tìm thấy thông tin đơn hàng.')
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('404')
      } else {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đơn hàng.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        const res = await orderService.cancelOrder(id)
        if (res && res.success) {
          showToast('Hủy đơn hàng thành công', 'success')
          fetchOrderDetail() // Reload dữ liệu
        } else {
          showToast(res.message || 'Không thể hủy đơn hàng', 'error')
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Có lỗi xảy ra khi hủy', 'error')
      }
    }
  }

  if (loading) return <PagePlaceholder title="Đang tải chi tiết đơn hàng..." />
  if (error === '404') return <PagePlaceholder title="404 - Không tìm thấy đơn hàng" />
  if (error) return <PagePlaceholder title="Lỗi" /> // We could show error message
  if (!order) return <PagePlaceholder title="Không có dữ liệu" />

  return (
    <>
      <Breadcrumb items={[{ label: 'Đơn hàng của tôi', path: '/my-orders' }, { label: `Đơn hàng #${order._id}` }]} />

      <div className="section-container order-detail-page">
        <div className="order-detail-header">
          <div>
            <h1 className="order-detail-title">Chi tiết đơn hàng #{order._id}</h1>
            <p className="order-detail-date">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
          </div>
          <div className="order-detail-actions">
            <OrderStatus status={order.orderStatus} />
            {order.orderStatus === 'Pending' && (
              <button className="btn btn-outline-danger ms-3" onClick={handleCancelOrder}>
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>

        <div className="row g-4 mt-2">
          {/* Thông tin khách hàng */}
          <div className="col-12 col-md-6">
            <div className="order-detail-box">
              <h3 className="order-detail-box-title">Địa chỉ nhận hàng</h3>
              <p><strong>{order.fullName}</strong></p>
              <p>SĐT: {order.phone}</p>
              <p>Địa chỉ: {order.address}</p>
              {order.note && <p>Ghi chú: {order.note}</p>}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="order-detail-box">
              <h3 className="order-detail-box-title">Thanh toán</h3>
              <p>Phương thức: {order.paymentMethod}</p>
              <p>Trạng thái thanh toán: {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="order-detail-box mt-4">
          <h3 className="order-detail-box-title">Sản phẩm đã đặt</h3>
          <div className="order-items-table">
            <div className="order-items-header d-none d-md-flex">
              <div className="col-name">Sản phẩm</div>
              <div className="col-price">Đơn giá</div>
              <div className="col-qty">Số lượng</div>
              <div className="col-total">Thành tiền</div>
            </div>
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <div className="col-name d-flex align-items-center gap-3">
                  <Link to={`/product/${item.product}`}>
                    <img src={getImageUrl(item.image)} alt={item.name} className="order-item-img" />
                  </Link>
                  <Link to={`/product/${item.product}`} className="order-item-name">{item.name}</Link>
                </div>
                <div className="col-price">
                  <span className="d-inline-block d-md-none text-muted me-2">Đơn giá:</span>
                  {formatCurrency(item.price)}
                </div>
                <div className="col-qty">
                  <span className="d-inline-block d-md-none text-muted me-2">Số lượng:</span>
                  {item.quantity}
                </div>
                <div className="col-total fw-bold">
                  <span className="d-inline-block d-md-none text-muted me-2">Thành tiền:</span>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary-box mt-4">
            <div className="order-summary-row">
              <span>Tạm tính:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="order-summary-row">
              <span>Phí vận chuyển:</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="order-summary-row">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="order-summary-row order-summary-total">
              <span>Tổng cộng:</span>
              <span className="total-price">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default OrderDetail
