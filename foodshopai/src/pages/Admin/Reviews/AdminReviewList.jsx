import { useState, useEffect } from 'react'
import { FiTrash2, FiStar } from 'react-icons/fi'
import { showToast } from '../../../utils/toast'
import adminService from '../../../services/adminService'

function AdminReviewList() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await adminService.getAllReviews()
      if (res.success) {
        setReviews(res.data)
      }
    } catch (error) {
      showToast('Lỗi khi tải danh sách đánh giá', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        const res = await adminService.deleteReview(id)
        if (res.success) {
          showToast('Xóa đánh giá thành công', 'success')
          fetchReviews()
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Có lỗi khi xóa', 'error')
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar 
          key={i} 
          style={{ 
            fill: i <= rating ? '#ffc107' : 'none', 
            color: i <= rating ? '#ffc107' : '#e4e5e9',
            marginRight: '2px'
          }} 
        />
      )
    }
    return stars
  }

  if (loading) {
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>
  }

  return (
    <div className="admin-page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title m-0">Quản lý Đánh giá</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Sản phẩm</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Chưa có đánh giá nào</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id}>
                  <td>
                    {review.user?.fullName || 'User ẩn danh'} <br />
                    <small className="text-muted">{review.user?.email}</small>
                  </td>
                  <td>
                    {review.product?.name || 'Sản phẩm đã xóa'}
                  </td>
                  <td>
                    {renderStars(review.rating)}
                  </td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'normal' }}>
                    {review.comment}
                  </td>
                  <td>{new Date(review.createdAt).toLocaleString('vi-VN')}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(review._id)}
                      title="Xóa đánh giá"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminReviewList
