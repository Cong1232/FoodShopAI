import { useState } from 'react'
import PropTypes from 'prop-types'
import { FiTag, FiX } from 'react-icons/fi'
import { formatCurrency } from '../../utils/formatCurrency.js'
import './CartSummary.css'

/**
 * CartSummary - Khối tóm tắt đơn hàng, dùng chung cho cả trang Cart và Checkout.
 *
 * Props:
 * - items: (tuỳ chọn) danh sách sản phẩm để hiển thị rút gọn (dùng ở Checkout,
 *   vì Checkout không hiển thị lại từng CartItem chi tiết như trang Cart)
 * - subtotal, discountAmount, shippingFee, total: các số liệu đã tính sẵn từ CartContext
 * - voucherCode, voucherError: trạng thái mã giảm giá hiện tại
 * - onApplyVoucher, onRemoveVoucher: callback xử lý voucher (không truyền -> ẩn ô nhập)
 * - children: khu vực hành động tuỳ theo trang (nút "Thanh toán" ở Cart,
 *   nút "Đặt hàng" ở Checkout)
 */
function CartSummary({
  items,
  subtotal,
  discountAmount,
  shippingFee,
  total,
  voucherCode,
  voucherError,
  onApplyVoucher,
  onRemoveVoucher,
  children,
}) {
  const [voucherInput, setVoucherInput] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    if (!voucherInput.trim()) return
    onApplyVoucher(voucherInput)
  }

  return (
    <div className="cart-summary">
      <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>

      {/* Danh sách rút gọn sản phẩm - chỉ hiển thị khi có truyền items (dùng ở Checkout) */}
      {items && items.length > 0 && (
        <ul className="cart-summary-items">
          {items.map((item) => (
            <li key={item.cartItemId}>
              <span className="cart-summary-item-name">
                {item.name} <span className="cart-summary-item-qty">x{item.quantity}</span>
              </span>
              <span>{formatCurrency((item.discountPrice ?? item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Ô nhập mã giảm giá - chỉ hiển thị khi component cha truyền onApplyVoucher */}
      {onApplyVoucher && (
        <div className="cart-summary-voucher">
          {voucherCode ? (
            <div className="cart-summary-voucher-applied">
              <span>
                <FiTag /> Mã <strong>{voucherCode}</strong> đã áp dụng
              </span>
              <button type="button" onClick={onRemoveVoucher} aria-label="Gỡ mã giảm giá">
                <FiX />
              </button>
            </div>
          ) : (
            <form className="cart-summary-voucher-form" onSubmit={handleApply}>
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
              />
              <button type="submit">Áp dụng</button>
            </form>
          )}
          {voucherError && <p className="cart-summary-voucher-error">{voucherError}</p>}
        </div>
      )}

      <div className="cart-summary-row">
        <span>Tạm tính</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="cart-summary-row cart-summary-row--discount">
          <span>Giảm giá</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      <div className="cart-summary-row">
        <span>Phí vận chuyển</span>
        <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
      </div>

      <div className="cart-summary-row cart-summary-row--total">
        <span>Tổng cộng</span>
        <span>{formatCurrency(total)}</span>
      </div>

      {children}
    </div>
  )
}

CartSummary.propTypes = {
  items: PropTypes.array,
  subtotal: PropTypes.number.isRequired,
  discountAmount: PropTypes.number.isRequired,
  shippingFee: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  voucherCode: PropTypes.string,
  voucherError: PropTypes.string,
  onApplyVoucher: PropTypes.func,
  onRemoveVoucher: PropTypes.func,
  children: PropTypes.node,
}

export default CartSummary
