import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import CartItem from '../../components/cart/CartItem.jsx'
import CartSummary from '../../components/cart/CartSummary.jsx'
import { useCart } from '../../context/CartContext.jsx'
import './Cart.css'

/**
 * Cart - Trang giỏ hàng.
 * Toàn bộ dữ liệu và thao tác (tăng/giảm/xoá/voucher) lấy từ CartContext,
 * được khởi tạo ban đầu từ mock/cartData.js (Buổi 4 chưa có Backend thật).
 */
function Cart() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    voucherCode,
    voucherError,
    applyVoucher,
    removeVoucher,
  } = useCart()

  return (
    <>
      <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />

      <div className="section-container cart-page">
        {items.length === 0 ? (
          // ===== Giỏ hàng trống =====
          <div className="cart-empty">
            <FiShoppingBag className="cart-empty-icon" />
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy khám phá hàng ngàn sản phẩm tươi ngon đang chờ bạn.</p>
            <Link to="/products" className="cart-empty-btn">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* ===== Danh sách sản phẩm trong giỏ ===== */}
            <div className="col-12 col-lg-8">
              <div className="cart-list-header">
                <span>Sản phẩm ({items.length})</span>
              </div>

              {items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}

              <Link to="/products" className="cart-continue-link">
                ← Tiếp tục mua sắm
              </Link>
            </div>

            {/* ===== Tóm tắt đơn hàng ===== */}
            <div className="col-12 col-lg-4">
              <CartSummary
                subtotal={subtotal}
                discountAmount={discountAmount}
                shippingFee={shippingFee}
                total={total}
                voucherCode={voucherCode}
                voucherError={voucherError}
                onApplyVoucher={applyVoucher}
                onRemoveVoucher={removeVoucher}
              >
                <Link to="/checkout" className="cart-checkout-btn">
                  Tiến hành thanh toán
                </Link>
              </CartSummary>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
