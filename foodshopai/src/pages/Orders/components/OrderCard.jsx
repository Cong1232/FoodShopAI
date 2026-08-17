import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import OrderStatus from './OrderStatus.jsx'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import './OrderCard.css'

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div>
          <span className="order-card-id">Đơn hàng #{order._id}</span>
          <span className="order-card-date">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <OrderStatus status={order.orderStatus} />
      </div>

      <div className="order-card-body">
        <span className="order-card-total">
          Tổng tiền: <strong>{formatCurrency(order.totalPrice)}</strong>
        </span>
        <span className="order-card-payment-method">
          ({order.paymentMethod})
        </span>
        
        <Link to={`/orders/${order._id}`} className="order-card-btn-detail">
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    paymentMethod: PropTypes.string.isRequired,
  }).isRequired,
}

export default OrderCard
