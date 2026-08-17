import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa'
import { formatCurrency } from '../../../utils/formatCurrency.js'
import { useCart } from '../../../context/CartContext.jsx'
import { showToast } from '../../../utils/toast.js'
import './ProductInfo.css'

/**
 * ProductInfo - Khối thông tin bên phải trang chi tiết sản phẩm.
 * Gồm: tên, đánh giá, lượt bán, giá, khối lượng, xuất xứ, tình trạng kho,
 * bộ chọn số lượng, và 2 nút hành động (Thêm vào giỏ / Mua ngay).
 *
 * Props:
 * - product: object sản phẩm đầy đủ (theo mock/products.js)
 */
function ProductInfo({ product }) {
  const navigate = useNavigate()
  const { name, category, price, discountPrice, rating, sold, origin, nutrition, unit, stock } = product
  const { addToCart } = useCart()

  // Số lượng người dùng muốn mua - mặc định 1, giới hạn trong khoảng [1, stock]
  const [quantity, setQuantity] = useState(1)

  const isOutOfStock = stock <= 0
  const finalPrice = discountPrice ?? price
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0

  // Sinh 5 icon sao dựa trên rating (hỗ trợ nửa sao)
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} />)
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />)
      else stars.push(<FaRegStar key={i} />)
    }
    return stars
  }

  const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, stock))
  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  const getValidQuantity = () => {
    let val = parseFloat(quantity)
    if (isNaN(val) || val < 1) return 1
    val = Math.round(val)
    if (val > stock) return stock
    return val
  }

  const handleAddToCart = async () => {
    const validQty = getValidQuantity()
    const res = await addToCart(product, validQty)
    if (res.success) {
      showToast('Đã thêm vào giỏ hàng.', 'success')
    } else {
      showToast(res.message, 'error')
    }
  }

  // "Mua ngay" điều hướng sang trang Checkout đã có sẵn (chỉ điều hướng, chưa xử lý đơn hàng thật)
  const handleBuyNow = async () => {
    const validQty = getValidQuantity()
    const res = await addToCart(product, validQty)
    if (res.success) {
      navigate('/checkout')
    } else {
      showToast(res.message, 'error')
    }
  }

  return (
    <div className="product-info">
      {/* Danh mục */}
      <span className="product-info-category">{category && category.name ? category.name : category}</span>

      {/* Tên sản phẩm */}
      <h1 className="product-info-name">{name}</h1>

      {/* Đánh giá + lượt bán */}
      <div className="product-info-meta">
        <span className="product-info-stars">{renderStars()}</span>
        <span className="product-info-rating-value">{rating.toFixed(1)}</span>
        <span className="product-info-divider">|</span>
        <span className="product-info-sold">Đã bán {sold}</span>
      </div>

      {/* Giá */}
      <div className="product-info-price-box">
        <span className="product-info-price">{formatCurrency(finalPrice)}</span>
        {discountPrice && (
          <>
            <span className="product-info-price-old">{formatCurrency(price)}</span>
            <span className="product-info-discount-badge">-{discountPercent}%</span>
          </>
        )}
      </div>

      {/* Thông tin nhanh: khối lượng, xuất xứ, tình trạng */}
      <ul className="product-info-quick-list">
        <li>
          <span>Đơn vị:</span> <strong>{unit}</strong>
        </li>
        <li>
          <span>Xuất xứ:</span> <strong>{origin}</strong>
        </li>
        {nutrition && (
        <li>
          <span>Dinh dưỡng:</span> <strong>{nutrition}</strong>
        </li>
        )}
        <li>
          <span>Tình trạng:</span>{' '}
          <strong className={stock === 0 ? 'text-danger' : (stock <= 10 ? 'text-warning' : 'text-success')}>
            {stock === 0 ? 'Hết hàng' : (stock <= 10 ? `Sắp hết (${stock})` : `Còn hàng (${stock})`)}
          </strong>
        </li>
      </ul>

      {/* Bộ chọn số lượng */}
      <div className="product-info-quantity">
        <span>Số lượng:</span>
        <div className="quantity-control">
          <button type="button" onClick={decreaseQuantity} disabled={quantity <= 1 || isOutOfStock} aria-label="Giảm số lượng">
            <FaMinus />
          </button>
          <input 
            type="text" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={() => {
              let val = parseFloat(quantity);
              if (isNaN(val) || val < 1) val = 1;
              else val = Math.round(val);
              if (val > stock) {
                val = stock;
                if (stock > 0) {
                  showToast(`Sản phẩm này chỉ còn ${stock} trong kho.`, 'error');
                } else {
                  showToast(`Sản phẩm đã hết hàng.`, 'error');
                }
              }
              setQuantity(val);
            }}
            aria-label="Số lượng" 
            disabled={isOutOfStock}
          />
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= stock}
            aria-label="Tăng số lượng"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="product-info-actions">
        <button
          type="button"
          className="product-info-btn product-info-btn--outline"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <FaShoppingCart /> Thêm vào giỏ
        </button>
        <button
          type="button"
          className="product-info-btn product-info-btn--primary"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
        >
          Mua ngay
        </button>
      </div>
    </div>
  )
}

ProductInfo.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    rating: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
    origin: PropTypes.string,
    nutrition: PropTypes.string,
    unit: PropTypes.string,
    stock: PropTypes.number.isRequired,
  }).isRequired,
}

export default ProductInfo
