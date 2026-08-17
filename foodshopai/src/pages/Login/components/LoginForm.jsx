import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'
import { useAuth } from '../../../context/AuthContext.jsx'
import { isValidEmail } from '../../../utils/validators.js'

/**
 * LoginForm - Form đăng nhập.
 * Validate phía Frontend (email hợp lệ, password không rỗng), gọi AuthContext.login()
 * để kiểm tra với dữ liệu mock (mock/userData.js).
 *
 * Buổi 4: chưa có Backend/JWT thật, "đăng nhập" chỉ so khớp mock user trong bộ nhớ.
 */
function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  // Nếu người dùng bị chuyển hướng tới /login từ 1 trang cần đăng nhập,
  // sau khi đăng nhập thành công sẽ quay lại đúng trang đó (mặc định về Trang chủ).
  const redirectTo = location.state?.from || '/'

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Kiểm tra dữ liệu nhập trước khi gọi login() - tránh gửi dữ liệu rỗng/sai định dạng
  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email.'
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email không hợp lệ.'

    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validate()) return

    const result = await login(formData.email, formData.password)
    if (!result.success) {
      setSubmitError(result.message)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Gợi ý tài khoản demo */}
      <div className="auth-demo-hint">
        Tài khoản đã đăng ký (hoặc đăng ký mới)
      </div>

      {submitError && <p className="auth-error-text mb-3 text-center">{submitError}</p>}

      <div className="auth-field">
        <label htmlFor="login-email">Email</label>
        <div className="auth-input-wrap">
          <input
            id="login-email"
            type="email"
            className={errors.email ? 'is-invalid' : ''}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
          />
        </div>
        {errors.email && <p className="auth-error-text">{errors.email}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">Mật khẩu</label>
        <div className="auth-input-wrap">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            className={errors.password ? 'is-invalid' : ''}
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange('password')}
          />
          <button
            type="button"
            className="auth-toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && <p className="auth-error-text">{errors.password}</p>}
      </div>

      <div className="auth-row-between">
        <div className="auth-checkbox">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me">Ghi nhớ đăng nhập</label>
        </div>
        <Link to="/forgot-password" className="auth-link">
          Quên mật khẩu?
        </Link>
      </div>

      <button type="submit" className="auth-submit-btn">
        Đăng nhập
      </button>

      <div className="auth-divider">Hoặc</div>

      {/* Đăng nhập mạng xã hội - chỉ dựng giao diện, chưa tích hợp OAuth thật */}
      <div className="auth-social-buttons">
        <button
          type="button"
          className="auth-social-btn auth-social-btn--google"
          onClick={() => alert('Tính năng đăng nhập Google sẽ được tích hợp cùng Backend.')}
        >
          <FaGoogle /> Đăng nhập với Google
        </button>
        <button
          type="button"
          className="auth-social-btn auth-social-btn--facebook"
          onClick={() => alert('Tính năng đăng nhập Facebook sẽ được tích hợp cùng Backend.')}
        >
          <FaFacebookF /> Đăng nhập với Facebook
        </button>
      </div>

      <p className="auth-footer-text">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="auth-link">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
