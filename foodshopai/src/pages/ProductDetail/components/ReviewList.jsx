import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaStar, FaStarHalfAlt, FaRegStar, FaUserCircle } from 'react-icons/fa'
import reviewService from '../../../services/reviewService'
import orderService from '../../../services/orderService'
import { useAuth } from '../../../context/AuthContext'
import ReviewForm from './ReviewForm'
import { showToast } from '../../../utils/toast'
import './ReviewList.css'

function ReviewList({ product, onReviewUpdated }) {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [eligibility, setEligibility] = useState({ canReview: false, orderId: null })
  const [userReview, setUserReview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchReviews()
    if (currentUser) {
      checkEligibility()
    }
  }, [product._id, currentUser])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await reviewService.getReviewsByProductId(product._id || product.id)
      if (res.success) {
        setReviews(res.data)
        if (currentUser) {
          const myReview = res.data.find(r => r.user._id === currentUser.id || r.user._id === currentUser._id)
          setUserReview(myReview)
        }
      }
    } catch (error) {
      console.error('Lỗi tải review:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkEligibility = async () => {
    try {
      const res = await orderService.getMyOrders()
      if (res.success) {
        // Tìm đơn hàng Completed chứa sản phẩm này
        const targetProductId = String(product._id || product.id);
        const completedOrder = res.data.find(order => 
          (order.orderStatus === 'Completed' || order.orderStatus === 'paid') && 
          order.orderItems.some(item => {
            const itemProductId = typeof item.product === 'object' ? String(item.product._id) : String(item.product);
            return itemProductId === targetProductId;
          })
        )
        if (completedOrder) {
          setEligibility({ canReview: true, orderId: completedOrder._id })
        }
      }
    } catch (error) {
      console.error('Lỗi kiểm tra đơn hàng:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        const res = await reviewService.deleteReview(id)
        if (res.success) {
          showToast('Xóa đánh giá thành công', 'success')
          setUserReview(null)
          fetchReviews()
          if (onReviewUpdated) onReviewUpdated()
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Có lỗi khi xóa', 'error')
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="star-filled" />)
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="star-filled" />)
      else stars.push(<FaRegStar key={i} className="star-empty" />)
    }
    return stars
  }

  return (
    <div className="review-section">
      <div className="review-summary">
        <div className="review-score-box">
          <span className="review-score-number">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
          <div className="review-score-stars">{renderStars(product.rating || 0)}</div>
          <span className="review-score-count">{product.reviewCount || 0} đánh giá</span>
        </div>
        
        <div className="review-progress-box">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length;
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="review-progress-row">
                <span className="review-progress-star">{star} sao</span>
                <div className="review-progress-bar-container">
                  <div className="review-progress-bar-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="review-progress-percent">{Math.round(percent)}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="review-form-container">
        {!currentUser ? (
          <div className="review-alert">
            <p>Vui lòng đăng nhập để đánh giá sản phẩm.</p>
          </div>
        ) : !eligibility.canReview ? (
          <div className="review-alert">
            <p>Bạn cần mua sản phẩm và nhận hàng thành công trước khi đánh giá.</p>
          </div>
        ) : userReview && !isEditing ? (
          <div className="my-review-actions">
            <h4>Đánh giá của bạn</h4>
            <div className="review-item">
              <div className="review-header">
                <div className="review-user">
                  {currentUser.avatar ? <img src={currentUser.avatar} alt="Avatar" className="review-avatar" /> : <FaUserCircle className="review-avatar-icon" />}
                  <span className="review-name">{currentUser.fullName}</span>
                </div>
                <span className="review-date">{new Date(userReview.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="review-stars">{renderStars(userReview.rating)}</div>
              <p className="review-comment">{userReview.comment}</p>
              <div className="review-btn-group">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDelete(userReview._id)}>Xóa</button>
              </div>
            </div>
          </div>
        ) : (
          <ReviewForm 
            productId={product._id || product.id} 
            orderId={eligibility.orderId}
            existingReview={userReview}
            onSuccess={() => {
              setIsEditing(false)
              fetchReviews()
              if (onReviewUpdated) onReviewUpdated()
            }}
            onCancel={isEditing ? () => setIsEditing(false) : null}
          />
        )}
      </div>

      <div className="review-list mt-4">
        <h4 className="mb-3">Tất cả đánh giá</h4>
        {loading ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="review-user">
                  {review.user?.avatar ? <img src={review.user.avatar} alt="Avatar" className="review-avatar" /> : <FaUserCircle className="review-avatar-icon" />}
                  <span className="review-name">{review.user?.fullName || 'Khách hàng'}</span>
                </div>
                <span className="review-date">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="review-stars">{renderStars(review.rating)}</div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

ReviewList.propTypes = {
  product: PropTypes.object.isRequired,
  onReviewUpdated: PropTypes.func
}

export default ReviewList
