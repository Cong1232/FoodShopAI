import PropTypes from 'prop-types';

/**
 * PagePlaceholder - Component dùng chung để hiển thị nội dung tạm thời
 * 
 * Mục đích:
 * - Thay thế cho các trang trống chưa hoàn thiện.
 * - Tránh lặp lại cùng một đoạn JSX ở nhiều trang rỗng.
 * - Khi cần đồng bộ giao diện "trang đang phát triển", chỉ sửa 1 nơi.
 */
function PagePlaceholder({ title, description = 'Trang đang được xây dựng, nội dung sẽ được cập nhật ở buổi tiếp theo.' }) {
  return (
    <div className="section-container py-5">
      <div className="text-center py-5">
        <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          {title}
        </h2>
        <p className="text-muted mb-0">{description}</p>
      </div>
    </div>
  )
}

PagePlaceholder.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

export default PagePlaceholder
