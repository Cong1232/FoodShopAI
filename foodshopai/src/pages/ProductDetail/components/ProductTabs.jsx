import { useState } from 'react'
import PropTypes from 'prop-types'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import ReviewList from './ReviewList'
import './ProductTabs.css'

// Khai báo danh sách tab dạng mảng để tránh lặp code JSX cho từng tab-button
const TABS = [
  { id: 'description', label: 'Mô tả' },
  { id: 'specification', label: 'Thông số' },
  { id: 'review', label: 'Đánh giá' },
]

/**
 * ProductTabs - Khối tab thông tin bên dưới phần chi tiết sản phẩm.
 * Gồm 3 tab: Mô tả, Thông số (dinh dưỡng/xuất xứ/khối lượng), Đánh giá.
 *
 * Props:
 * - product: object sản phẩm đầy đủ (theo mock/products.js)
 */
function ProductTabs({ product, onReviewUpdated }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const { description, nutrition, origin, unit, rating, sold } = product

  // Sinh 5 icon sao dựa trên rating trung bình của sản phẩm
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} />)
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />)
      else stars.push(<FaRegStar key={i} />)
    }
    return stars
  }

  return (
    <div className="product-tabs">
      {/* ===== Thanh chọn tab ===== */}
      <div className="product-tabs-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`product-tabs-btn ${activeTab === tab.id ? 'product-tabs-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Nội dung tab ===== */}
      <div className="product-tabs-content">
        {activeTab === 'description' && (
          <div className="product-tabs-pane">
            <p>{description}</p>
          </div>
        )}

        {activeTab === 'specification' && (
          <div className="product-tabs-pane">
            <table className="product-tabs-table">
              <tbody>
                <tr>
                  <td>Đơn vị</td>
                  <td>{unit}</td>
                </tr>
                <tr>
                  <td>Xuất xứ</td>
                  <td>{origin}</td>
                </tr>
                <tr>
                  <td>Thông tin dinh dưỡng</td>
                  <td>{nutrition}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="product-tabs-pane product-tabs-review">
            <ReviewList product={product} onReviewUpdated={onReviewUpdated} />
          </div>
        )}
      </div>
    </div>
  )
}

ProductTabs.propTypes = {
  product: PropTypes.shape({
    description: PropTypes.string.isRequired,
    origin: PropTypes.string,
    nutrition: PropTypes.string,
    unit: PropTypes.string,
    rating: PropTypes.number.isRequired,
    sold: PropTypes.number.isRequired,
  }).isRequired,
}

export default ProductTabs
