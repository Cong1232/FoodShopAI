import { useState } from 'react'
import { FiMail, FiCheckCircle } from 'react-icons/fi'
import './Newsletter.css'

/**
 * Newsletter - Section đăng ký nhận email khuyến mãi.
 * Buổi 2: chỉ xử lý validate + hiển thị trạng thái phía Frontend,
 * chưa gọi API gửi email thật (sẽ nối Backend ở buổi sau).
 */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate email đơn giản bằng regex trước khi "đăng ký"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Vui lòng nhập email hợp lệ.')
      setSubmitted(false)
      return
    }

    setError('')
    setSubmitted(true)
    // TODO (buổi sau): gọi API POST /api/newsletter để lưu email vào MongoDB
  }

  return (
    <section className="newsletter">
      <div className="section-container newsletter-inner">
        <div className="newsletter-text">
          <h2 className="newsletter-title">Đăng ký nhận ưu đãi</h2>
          <p className="newsletter-desc">
            Nhận thông tin khuyến mãi, sản phẩm mới sớm nhất qua email của bạn.
          </p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
          <div className="newsletter-input-wrap">
            <FiMail className="newsletter-input-icon" />
            <input
              type="email"
              className="newsletter-input"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="newsletter-btn">
            Đăng ký
          </button>
        </form>

        {error && <p className="newsletter-message newsletter-message--error">{error}</p>}
        {submitted && !error && (
          <p className="newsletter-message newsletter-message--success">
            <FiCheckCircle /> Đăng ký thành công! Cảm ơn bạn đã quan tâm đến FoodShopAI.
          </p>
        )}
      </div>
    </section>
  )
}

export default Newsletter
