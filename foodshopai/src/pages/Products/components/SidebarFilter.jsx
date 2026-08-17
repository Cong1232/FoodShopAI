import PropTypes from 'prop-types'
import { FiRotateCcw } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import './SidebarFilter.css'

/**
 * SidebarFilter - Bộ lọc sản phẩm hiển thị dạng sidebar.
 * Gồm 3 nhóm lọc: Danh mục (chọn nhiều), Khoảng giá (chọn 1), Đánh giá (chọn 1).
 * Là component thuần hiển thị - toàn bộ state lọc được quản lý ở Products.jsx,
 * SidebarFilter chỉ nhận dữ liệu qua props và bắn callback khi người dùng thao tác.
 *
 * Props:
 * - categories: mảng tên danh mục (string)
 * - selectedCategories: mảng danh mục đang được chọn
 * - onCategoryToggle(category): bật/tắt 1 danh mục
 * - priceRanges: mảng { id, label, min, max }
 * - selectedPriceRange: id khoảng giá đang chọn (hoặc null)
 * - onPriceRangeChange(id): chọn/bỏ chọn khoảng giá
 * - ratingOptions: mảng số sao [5, 4, 3]
 * - selectedRating: số sao đang chọn (hoặc null)
 * - onRatingChange(rating): chọn/bỏ chọn mức đánh giá
 * - onReset(): xoá toàn bộ bộ lọc
 */
function SidebarFilter({
  categories,
  selectedCategories,
  onCategoryToggle,
  priceRanges,
  selectedPriceRange,
  onPriceRangeChange,
  ratingOptions,
  selectedRating,
  onRatingChange,
  onReset,
}) {
  return (
    <aside className="sidebar-filter">
      <div className="sidebar-filter-header">
        <h3 className="sidebar-filter-title">Bộ lọc</h3>
        <button type="button" className="sidebar-filter-reset" onClick={onReset}>
          <FiRotateCcw /> Reset
        </button>
      </div>

      {/* ===== Danh mục ===== */}
      <div className="sidebar-filter-group">
        <h4 className="sidebar-filter-group-title">Danh mục</h4>
        {categories.map((category) => {
          const catId = category._id || category.id || category
          const catName = category.name || category
          return (
            <div className="form-check" key={catId}>
              <input
                type="checkbox"
                className="form-check-input"
                id={`category-${catId}`}
                checked={selectedCategories.includes(catId)}
                onChange={() => onCategoryToggle(catId)}
              />
              <label className="form-check-label" htmlFor={`category-${catId}`}>
                {catName}
              </label>
            </div>
          )
        })}
      </div>

      {/* ===== Khoảng giá ===== */}
      <div className="sidebar-filter-group">
        <h4 className="sidebar-filter-group-title">Khoảng giá</h4>
        {priceRanges.map((range) => (
          <div className="form-check" key={range.id}>
            <input
              type="radio"
              className="form-check-input"
              name="price-range"
              id={range.id}
              checked={selectedPriceRange === range.id}
              onChange={() => onPriceRangeChange(range.id)}
            />
            <label
              className="form-check-label"
              htmlFor={range.id}
              onClick={() => {
                // Cho phép bấm lại vào label đang chọn để bỏ chọn (UX linh hoạt hơn radio thuần)
                if (selectedPriceRange === range.id) onPriceRangeChange(range.id)
              }}
            >
              {range.label}
            </label>
          </div>
        ))}
      </div>

      {/* ===== Đánh giá ===== */}
      <div className="sidebar-filter-group">
        <h4 className="sidebar-filter-group-title">Đánh giá</h4>
        {ratingOptions.map((star) => (
          <div className="form-check" key={star}>
            <input
              type="radio"
              className="form-check-input"
              name="rating-filter"
              id={`rating-${star}`}
              checked={selectedRating === star}
              onChange={() => onRatingChange(star)}
            />
            <label className="form-check-label sidebar-filter-rating-label" htmlFor={`rating-${star}`}>
              {Array.from({ length: star }, (_, i) => (
                <FaStar key={i} />
              ))}
              <span>{star} sao trở lên</span>
            </label>
          </div>
        ))}
      </div>
    </aside>
  )
}

SidebarFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCategoryToggle: PropTypes.func.isRequired,
  priceRanges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedPriceRange: PropTypes.string,
  onPriceRangeChange: PropTypes.func.isRequired,
  ratingOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedRating: PropTypes.number,
  onRatingChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

SidebarFilter.defaultProps = {
  selectedPriceRange: null,
  selectedRating: null,
}

export default SidebarFilter
