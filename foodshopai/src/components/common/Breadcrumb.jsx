import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './Breadcrumb.css'

/**
 * Breadcrumb - Thanh điều hướng phân cấp (Trang chủ / Sản phẩm / ...).
 * Dùng chung cho Products, ProductDetail và các trang khác sau này.
 *
 * Props:
 * - items: mảng { label, path } - phần tử cuối cùng không cần path (trang hiện tại)
 */
function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="app-breadcrumb">
      <div className="section-container">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li
                key={item.label}
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {isLast || !item.path ? item.label : <Link to={item.path}>{item.label}</Link>}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ).isRequired,
}

export default Breadcrumb
