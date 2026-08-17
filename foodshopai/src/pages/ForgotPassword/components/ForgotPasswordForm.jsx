import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiMail } from 'react-icons/fi'
import { isValidEmail } from '../../../utils/validators.js'

/**
 * ForgotPasswordForm - Form yêu cầu khôi phục mật khẩu qua email.
 * Buổi 4: chưa có Backend gửi email thật, sau khi submit hợp lệ sẽ hiển thị
 * thông báo thành công dạng mock (giả lập đã gửi email khôi phục).
 */
function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Vui lòng nhập email.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Email không hợp lệ.')
      return
    }

    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      }).then(r => r.json());

      if (res.success) {
        setIsSubmitted(true);
      } else {
        // Luôn coi như thành công để bảo mật, hoặc show đúng lỗi tuỳ res
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    }
  }

  // ===== Trạng thái đã gửi thành công (mock) =====
  if (isSubmitted) {
    return (
      <div className="auth-success-box">
        <FiCheckCircle className="auth-success-icon" />
        <h3 className="mb-2" style={{ fontWeight: 700 }}>
          Đã gửi email khôi phục!
        </h3>
        <p className="text-muted mb-4">
          Nếu Email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
        </p>
        <Link to="/login" className="auth-link">
          Quay lại Đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="auth-subtitle mb-4">
        Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
      </p>

      <div className="auth-field">
        <label htmlFor="forgot-email">Email</label>
        <div className="auth-input-wrap">
          <input
            id="forgot-email"
            type="email"
            className={error ? 'is-invalid' : ''}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
          />
        </div>
        {error && <p className="auth-error-text">{error}</p>}
      </div>

      <button type="submit" className="auth-submit-btn">
        <FiMail style={{ marginRight: 6 }} /> Gửi Email
      </button>

      <p className="auth-footer-text mt-3">
        Nhớ lại mật khẩu?{' '}
        <Link to="/login" className="auth-link">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}

export default ForgotPasswordForm
