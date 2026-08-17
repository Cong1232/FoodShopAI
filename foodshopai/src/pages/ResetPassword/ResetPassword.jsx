import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import { showToast } from '../../utils/toast'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên.')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, confirmPassword })
      }).then(r => r.json())

      if (res.success) {
        showToast('Đặt lại mật khẩu thành công.', 'success')
        navigate('/login')
      } else {
        setError(res.message || 'Lỗi đổi mật khẩu')
        if (res.message && res.message.includes('hết hạn')) {
          showToast('Liên kết đã hết hạn, vui lòng yêu cầu lại.', 'error')
        }
      }
    } catch (err) {
      setError('Lỗi kết nối đến server')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-food">Food</span>
          <span className="logo-shop">Shop</span>
          <span className="logo-ai">AI</span>
        </Link>

        <form onSubmit={handleSubmit} noValidate>
          <h2 className="auth-title mb-4" style={{ textAlign: 'center' }}>Đặt Lại Mật Khẩu</h2>

          <div className="auth-field">
            <label htmlFor="reset-password">Mật khẩu mới</label>
            <div className="auth-input-wrap">
              <input
                id="reset-password"
                type="password"
                className={error && error.includes('Mật khẩu') ? 'is-invalid' : ''}
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reset-confirm">Nhập lại mật khẩu mới</label>
            <div className="auth-input-wrap">
              <input
                id="reset-confirm"
                type="password"
                className={error && error.includes('khớp') ? 'is-invalid' : ''}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
              />
            </div>
            {error && <p className="auth-error-text mt-1">{error}</p>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            <FiLock style={{ marginRight: 6 }} /> Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
