import { FiSearch, FiX } from 'react-icons/fi'
import PropTypes from 'prop-types'
import './SearchBar.css'

/**
 * SearchBar - Ô tìm kiếm sản phẩm theo tên hoặc danh mục.
 * Là component "controlled" - giá trị và việc xử lý tìm kiếm nằm ở component cha
 * (Products.jsx), SearchBar chỉ chịu trách nhiệm hiển thị và bắn sự kiện thay đổi.
 * Nhờ vậy việc tìm kiếm diễn ra realtime ngay khi người dùng gõ.
 *
 * Props:
 * - value: giá trị hiện tại của ô tìm kiếm
 * - onChange(value): callback khi giá trị thay đổi
 */
function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar" onSubmit={(e) => {
      e.preventDefault();
      if (onSubmit) onSubmit(value);
    }}>
      <button type="submit" className="search-bar-icon-btn" aria-label="Tìm kiếm" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <FiSearch className="search-bar-icon" />
      </button>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Tìm theo tên sản phẩm hoặc danh mục..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => {
            onChange('');
            if (onSubmit) onSubmit('');
          }}
          aria-label="Xoá tìm kiếm"
        >
          <FiX />
        </button>
      )}
    </form>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
}

export default SearchBar
