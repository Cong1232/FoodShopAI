import PropTypes from 'prop-types'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Pagination.css'

/**
 * Pagination - Component phân trang dùng chung (style theo Bootstrap Pagination).
 * Component thuần hiển thị + gọi callback, không tự quản lý state trang hiện tại,
 * giúp trang cha (Products...) toàn quyền kiểm soát dữ liệu hiển thị.
 *
 * Props:
 * - currentPage: trang hiện tại (bắt đầu từ 1)
 * - totalPages: tổng số trang
 * - onPageChange(page): callback khi người dùng chọn trang khác
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Sinh mảng số trang [1, 2, 3, ..., totalPages] để render
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
    // Cuộn lên đầu danh sách sản phẩm để người dùng thấy ngay kết quả trang mới
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav aria-label="Phân trang sản phẩm" className="app-pagination">
      <ul className="pagination justify-content-center mb-0">
        {/* Nút về trang trước */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(currentPage - 1)} aria-label="Trang trước">
            <FiChevronLeft />
          </button>
        </li>

        {/* Danh sách số trang */}
        {pageNumbers.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => goToPage(page)}>
              {page}
            </button>
          </li>
        ))}

        {/* Nút sang trang sau */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => goToPage(currentPage + 1)} aria-label="Trang sau">
            <FiChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default Pagination
