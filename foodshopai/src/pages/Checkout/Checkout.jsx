import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import CartSummary from '../../components/cart/CartSummary.jsx'
import CheckoutForm from './components/CheckoutForm.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import orderService from '../../services/orderService.js'
import { showToast } from '../../utils/toast.js'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { items, subtotal, discountAmount, shippingFee, total, voucherCode, clearCart } = useCart()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('payment') === 'failed') {
      showToast('Thanh toán VNPay thất bại, vui lòng thử lại', 'error')
    }
  }, [location.search])

  const handlePlaceOrder = async (customerInfo) => {
    const fullAddress = `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`

    const orderData = {
      orderItems: items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        price: item.discountPrice ?? item.price,
        quantity: item.quantity,
      })),
      fullName: customerInfo.fullName,
      phone: customerInfo.phone,
      address: fullAddress,
      note: customerInfo.note,
      paymentMethod: customerInfo.paymentMethod,
      subtotal,
      shippingFee,
      discount: discountAmount,
      totalPrice: total,
    }

    try {
      const res = await orderService.createOrder(orderData)
      if (res && res.success) {
        clearCart()
        
        if (orderData.paymentMethod === 'VNPay') {
          // Goi API tao url thanh toan VNPay
          const token = localStorage.getItem('token');
          const paymentRes = await fetch('http://localhost:5000/api/payment/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: res.data._id, amount: res.data.totalPrice })
          }).then(r => r.json());
          
          if (paymentRes.success && paymentRes.data) {
            window.location.href = paymentRes.data;
          } else {
            showToast('Lỗi tạo thanh toán VNPay', 'error')
            navigate('/order-success', { state: { order: res.data } })
          }
        } else if (orderData.paymentMethod === 'Momo') {
          // Goi API tao url thanh toan Momo
          const token = localStorage.getItem('token');
          const paymentRes = await fetch('http://localhost:5000/api/payment/mock/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: res.data._id, amount: res.data.totalPrice })
          }).then(r => r.json());
          
          if (paymentRes.success && paymentRes.data) {
            navigate(paymentRes.data.paymentUrl);
          } else {
            showToast('Lỗi tạo thanh toán MoMo', 'error')
            navigate('/order-success', { state: { order: res.data } })
          }
        } else {
          if (res.emailSent) {
            showToast('Email xác nhận đơn hàng đã được gửi', 'success')
          }
          navigate('/order-success', { state: { order: res.data } })
        }
      } else {
        showToast(res?.message || 'Có lỗi xảy ra', 'error')
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Lỗi đặt hàng', 'error')
    }
  }

  // Không cho thanh toán khi giỏ hàng trống (tránh đặt đơn hàng rỗng)
  if (items.length === 0) {
    return (
      <div className="section-container py-5 text-center">
        <h2 className="fw-bold mb-3">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted mb-4">Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <Link to="/products" className="btn" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Giỏ hàng', path: '/cart' }, { label: 'Thanh toán' }]} />

      <div className="section-container checkout-page">
        <div className="row g-4">
          {/* ===== Form thông tin + phương thức thanh toán ===== */}
          <div className="col-12 col-lg-7">
            <CheckoutForm
              defaultValues={{
                fullName: currentUser?.fullName || '',
                phone: currentUser?.phone || '',
                email: currentUser?.email || '',
              }}
              onSubmit={handlePlaceOrder}
            />
          </div>

          {/* ===== Tóm tắt đơn hàng + nút Đặt hàng ===== */}
          <div className="col-12 col-lg-5">
            <CartSummary
              items={items}
              subtotal={subtotal}
              discountAmount={discountAmount}
              shippingFee={shippingFee}
              total={total}
              voucherCode={voucherCode}
            >
              {/* Nút submit form CheckoutForm thông qua thuộc tính form="checkout-form" */}
              <button type="submit" form="checkout-form" className="checkout-submit-btn">
                Đặt hàng
              </button>
            </CartSummary>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout
