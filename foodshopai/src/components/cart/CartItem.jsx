import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import './CartItem.css'

/**
 * CartItem - Hiển thị 1 sản phẩm trong giỏ hàng (ảnh, tên, giá, số lượng, xoá).
 * Là component thuần - toàn bộ state giỏ hàng thật sự nằm ở CartContext,
 * CartItem chỉ nhận dữ liệu + callback qua props.
 *
 * Props:
 * - item: { cartItemId, productId, name, image, price, discountPrice, quantity, stock }
 * - onIncrease(cartItemId), onDecrease(cartItemId), onRemove(cartItemId), onUpdateQuantity(cartItemId, qty)
 */
function CartItem({ item, onIncrease, onDecrease, onUpdateQuantity, onRemove }) {
  const { cartItemId, productId, name, image, price, discountPrice, quantity, stock } = item

  const unitPrice = discountPrice ?? price
  const lineTotal = unitPrice * quantity

  const [localQty, setLocalQty] = useState(quantity)

  useEffect(() => {
    setLocalQty(quantity)
  }, [quantity])

  const handleBlur = () => {
    let val = parseFloat(localQty)
    if (isNaN(val) || val < 1) {
      val = 1
    } else {
      val = Math.round(val)
    }
    if (val > stock) {
      val = stock;
      import('../../utils/toast.js').then(({ showToast }) => {
        showToast(`Chỉ còn ${stock} sản phẩm trong kho.`, 'error');
      });
    }
    
    setLocalQty(val)
    if (val !== quantity && onUpdateQuantity) {
      onUpdateQuantity(productId, val)
    }
  }

  return (
    <div className="cart-item">
      <Link to={`/product/${productId}`} className="cart-item-image-wrap">
        <img src={getImageUrl(image)} alt={name} className="cart-item-image" />
      </Link>

      <div className="cart-item-info">
        <Link to={`/product/${productId}`} className="cart-item-name">
          {name}
        </Link>

        <div className="cart-item-price-row">
          <span className="cart-item-price">{formatCurrency(unitPrice)}</span>
          {discountPrice && <span className="cart-item-price-old">{formatCurrency(price)}</span>}
        </div>

        {/* Trên mobile: số lượng + xoá hiển thị ngay dưới giá */}
        <div className="cart-item-mobile-actions">
          <div className="cart-item-quantity">
            <button type="button" onClick={() => onDecrease(productId)} disabled={quantity <= 1}>
              <FiMinus />
            </button>
            <input 
              type="text" 
              value={localQty} 
              onChange={(e) => setLocalQty(e.target.value)}
              onBlur={handleBlur}
            />
            <button type="button" onClick={() => onIncrease(productId)} disabled={quantity >= stock}>
              <FiPlus />
            </button>
          </div>
          <button
            type="button"
            className="cart-item-remove"
            onClick={() => onRemove(productId)}
            aria-label="Xoá sản phẩm"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* Desktop: số lượng và thành tiền hiển thị dạng cột riêng */}
      <div className="cart-item-quantity cart-item-quantity--desktop">
        <button type="button" onClick={() => onDecrease(productId)} disabled={quantity <= 1}>
          <FiMinus />
        </button>
        <input 
          type="text" 
          value={localQty} 
          onChange={(e) => setLocalQty(e.target.value)}
          onBlur={handleBlur}
        />
        <button type="button" onClick={() => onIncrease(productId)} disabled={quantity >= stock}>
          <FiPlus />
        </button>
      </div>

      <div className="cart-item-total cart-item-total--desktop">{formatCurrency(lineTotal)}</div>

      <button
        type="button"
        className="cart-item-remove cart-item-remove--desktop"
        onClick={() => onRemove(productId)}
        aria-label="Xoá sản phẩm"
      >
        <FiTrash2 />
      </button>
    </div>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    cartItemId: PropTypes.string,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
}

export default CartItem
