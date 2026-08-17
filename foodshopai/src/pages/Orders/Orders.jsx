import { useEffect, useState } from 'react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import PagePlaceholder from '../../components/common/PagePlaceholder.jsx'
import OrderCard from './components/OrderCard.jsx'
import orderService from '../../services/orderService.js'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderService.getMyOrders()
      if (res && res.success) {
        setOrders(res.data)
      } else {
        setError('Không thể tải lịch sử đơn hàng')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PagePlaceholder title="Đang tải lịch sử đơn hàng..." />
  }

  if (error) {
    return <PagePlaceholder title="Lỗi" /> // We could also show the error message.
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Đơn hàng của tôi' }]} />

      <div className="section-container orders-page">
        <h1 className="orders-title">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="fw-bold mb-3">Bạn chưa có đơn hàng nào.</h3>
            <p className="text-muted">Hãy mua sắm để xem lịch sử đơn hàng của bạn.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Orders
