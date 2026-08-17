import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaStar } from 'react-icons/fa'
import reviewService from '../../../services/reviewService'
import { showToast } from '../../../utils/toast'
import './ReviewForm.css'

function ReviewForm({ productId, orderId, existingReview, onSuccess, onCancel }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment)
    }
  }, [existingReview])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá', 'error')
      return
    }

    try {
      setLoading(true)
      const data = { product: productId, order: orderId, rating, comment }
      let res;
      
      if (existingReview) {
        res = await reviewService.updateReview(existingReview._id, data)
      } else {
        res = await reviewService.createReview(data)
      }

      if (res.success) {
        showToast(existingReview ? 'Cập nhật đánh giá thành công' : 'Gửi đánh giá thành công', 'success')
        if (!existingReview) {
          setRating(5)
          setComment('')
        }
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Có lỗi xảy ra', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>{existingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}</h4>
      
      <div className="review-form-rating">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1
          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                style={{ display: 'none' }}
              />
              <FaStar
                className="star"
                color={ratingValue <= (hover || rating) ? "#FF9800" : "#e4e5e9"}
                size={24}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer', transition: 'color 200ms' }}
              />
            </label>
          )
        })}
      </div>

      <div className="review-form-group">
        <textarea
          className="form-control"
          rows="4"
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>

      <div className="review-form-actions mt-3">
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang gửi...' : (existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
        </button>
      </div>
    </form>
  )
}

ReviewForm.propTypes = {
  productId: PropTypes.string.isRequired,
  orderId: PropTypes.string,
  existingReview: PropTypes.object,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
}

export default ReviewForm
