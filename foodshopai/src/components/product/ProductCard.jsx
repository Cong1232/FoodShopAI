import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../context/CartContext.jsx'
import { showToast } from '../../utils/toast.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { getImageUrl } from '../../utils/getImageUrl.js'
import './ProductCard.css'

/**
 * ProductCard - Card sản phẩm dùng chung cho toàn bộ website
 * (Home: Flash Sale / Sản phẩm nổi bật, Products: danh sách sản phẩm...).
 *
 * Component này được thiết kế để nhận nhiều "hình dạng" dữ liệu khác nhau
 * (dữ liệu mock ở Buổi 2 và dữ liệu mock đầy đủ ở Buổi 3 có tên field khác nhau),
 * nên bên trong sẽ tự chuẩn hoá lại 1 lần thay vì bắt Home.jsx / Products.jsx
 * phải sửa lại dữ liệu đã có - tránh phá vỡ giao diện đã hoàn thành ở Buổi 1, 2.
 *
 * Field được hỗ trợ (không bắt buộc phải có đủ tất cả):
 * - id, name, category
 * - image (string) hoặc images (mảng ảnh) -> tự lấy ảnh đầu tiên
 * - price / oldPrice: giá gốc
 * - discountPrice / newPrice: giá sau giảm (nếu có)
 * - discountPercent: phần trăm giảm giá (tự tính nếu không truyền sẵn)
 * - rating, ratingCount, sold: đánh giá & số lượng đã bán
 * - isNew, isHot, isSale: cờ để hiển thị Badge tương ứng
 *
 * Buổi 3: chưa gọi API, nút "Thêm vào giỏ" chỉ là giao diện.
 */
function ProductCard({ product }) {
  const {
    _id,
    id = _id,
    name,
    category,
    image,
    images,
    price,
    oldPrice,
    discountPrice,
    newPrice,
    discountPercent,
    rating = 0,
    ratingCount,
    sold,
    isNew,
    isHot,
    isSale,
  } = product
  
  const { addToCart } = useCart()

  // ===== Chuẩn hoá dữ liệu ảnh: ưu tiên "image", fallback sang phần tử đầu của "images" =====
  const displayImage = getImageUrl(image || (images && images[0]))

  // ===== Chuẩn hoá giá: hỗ trợ cả 2 cặp field (oldPrice/newPrice) và (price/discountPrice) =====
  const finalOldPrice = oldPrice ?? (discountPrice ? price : null)
  const finalNewPrice = newPrice ?? discountPrice ?? price

  // ===== Tự tính % giảm giá nếu chưa có sẵn =====
  const finalDiscountPercent =
    discountPercent ??
    (finalOldPrice && finalNewPrice ? Math.round(((finalOldPrice - finalNewPrice) / finalOldPrice) * 100) : 0)

  const hasSaleBadge = isSale || finalDiscountPercent > 0

  // Sinh mảng 5 icon sao dựa trên rating (hỗ trợ nửa sao)
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />)
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />)
      } else {
        stars.push(<FaRegStar key={i} />)
      }
    }
    return stars
  }

  const handleAddToCart = async () => {
    const res = await addToCart(product, 1)
    if (res.success) {
      showToast('Đã thêm vào giỏ hàng.', 'success')
    } else {
      showToast(res.message, 'error')
    }
  }

  return (
    <div className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
      {/* ===== Cụm Badge góc trái: NEW / HOT / -x% ===== */}
      <div className="product-card-badges">
        {product.stock === 0 && <span className="product-card-badge product-card-badge--out-of-stock" style={{backgroundColor: 'var(--color-danger)'}}>Hết hàng</span>}
        {isNew && product.stock > 0 && <span className="product-card-badge product-card-badge--new">NEW</span>}
        {isHot && product.stock > 0 && <span className="product-card-badge product-card-badge--hot">HOT</span>}
        {hasSaleBadge && finalDiscountPercent > 0 && product.stock > 0 && (
          <span className="product-card-badge product-card-badge--sale">-{finalDiscountPercent}%</span>
        )}
      </div>

      <Link to={`/product/${id}`} className="product-card-image-wrap">
        <img src={displayImage} alt={name} className="product-card-image" loading="lazy" />
      </Link>

      <div className="product-card-body">
        {/* Danh mục - chỉ hiển thị nếu dữ liệu có category */}
        {category && <span className="product-card-category">{typeof category === 'object' ? category.name : category}</span>}

        <h3 className="product-card-name" title={name}>
          {name}
        </h3>

        <div className="product-card-rating">
          <span className="product-card-stars">{renderStars()}</span>
          {typeof ratingCount === 'number' && (
            <span className="product-card-rating-count">({ratingCount})</span>
          )}
          {typeof sold === 'number' && (
            <span className="product-card-sold">Đã bán {sold}</span>
          )}
        </div>

        <div className="product-card-price">
          <span className="product-card-price-new">{formatCurrency(finalNewPrice)}</span>
          {finalOldPrice && <span className="product-card-price-old">{formatCurrency(finalOldPrice)}</span>}
        </div>

        <div className="product-card-actions">
          <Link to={`/product/${id}`} className="product-card-btn product-card-btn--outline">
            Xem chi tiết
          </Link>
          <button
            type="button"
            className="product-card-btn product-card-btn--primary"
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Hết' : <FaShoppingCart />}
          </button>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number,
    oldPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    newPrice: PropTypes.number,
    discountPercent: PropTypes.number,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    sold: PropTypes.number,
    isNew: PropTypes.bool,
    isHot: PropTypes.bool,
    isSale: PropTypes.bool,
  }).isRequired,
}

export default ProductCard
