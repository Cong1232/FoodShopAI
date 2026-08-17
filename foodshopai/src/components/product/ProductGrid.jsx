import PropTypes from 'prop-types'
import ProductCard from './ProductCard.jsx'
import './ProductGrid.css'

/**
 * ProductGrid - Component dùng chung để render một lưới ProductCard.
 * Được tách riêng để trang Products (và các trang khác sau này) không phải
 * lặp lại đoạn `.map()` + class grid mỗi lần cần hiển thị danh sách sản phẩm.
 *
 * Props:
 * - products: mảng sản phẩm (theo cấu trúc mock/products.js)
 * - emptyMessage: thông báo hiển thị khi không có sản phẩm nào (ví dụ lọc không ra kết quả)
 */
function ProductGrid({ products, emptyMessage }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
}

ProductGrid.defaultProps = {
  emptyMessage: 'Không tìm thấy sản phẩm phù hợp.',
}

export default ProductGrid
