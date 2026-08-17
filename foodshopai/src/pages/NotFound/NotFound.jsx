import { Link } from 'react-router-dom'

/**
 * NotFound - Trang hiển thị khi người dùng truy cập route không tồn tại (404).
 */
function NotFound() {
  return (
    <div className="section-container text-center py-5">
      <h1 className="fw-bold" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}>
        404
      </h1>
      <p className="text-muted mb-4">Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        to="/"
        className="btn"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
      >
        Về trang chủ
      </Link>
    </div>
  )
}

export default NotFound
