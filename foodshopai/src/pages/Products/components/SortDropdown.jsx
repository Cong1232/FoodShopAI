import PropTypes from 'prop-types'
import './SortDropdown.css'

/**
 * SortDropdown - Dropdown chọn tiêu chí sắp xếp danh sách sản phẩm.
 * Danh sách tuỳ chọn được truyền từ mock/products.js (sortOptions) để
 * tránh hard-code trực tiếp trong component.
 *
 * Props:
 * - value: giá trị sắp xếp hiện tại
 * - onChange(value): callback khi người dùng đổi tiêu chí sắp xếp
 * - options: mảng { value, label }
 */
function SortDropdown({ value, onChange, options }) {
  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select" className="sort-dropdown-label">
        Sắp xếp:
      </label>
      <select
        id="sort-select"
        className="form-select sort-dropdown-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

SortDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default SortDropdown
