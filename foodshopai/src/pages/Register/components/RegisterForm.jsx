import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { isValidEmail, isValidPhone, isValidPassword } from '../../../utils/validators.js'

// Giá trị khởi tạo cho form - tách riêng để dễ reset và tránh lặp code
const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
}

/**
 * RegisterForm - Form đăng ký tài khoản mới.
 * Validate đầy đủ: họ tên, email, số điện thoại, mật khẩu, xác nhận mật khẩu,
 * bắt buộc đồng ý điều khoản. Gọi AuthContext.register() để tạo user mock mới.
 */
function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field) => (e) => {
    const value = field === 'agreeTerms' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Validate toàn bộ field, trả về true nếu hợp lệ
  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên.'

    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email.'
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email không hợp lệ.'

    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại.'
    else if (!isValidPhone(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ.'

    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu.'
    else if (!isValidPassword(formData.password)) newErrors.password = 'Mật khẩu cần tối thiểu 6 ký tự.'

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    }

    if (!formData.agreeTerms) newErrors.agreeTerms = 'Bạn cần đồng ý điều khoản để tiếp tục.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validate()) return

    const result = await register(formData)
    if (!result.success) {
      setSubmitError(result.message)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && <p className="auth-error-text mb-3 text-center">{submitError}</p>}

      <div className="auth-field">
        <label htmlFor="register-fullname">Họ tên</label>
        <div className="auth-input-wrap">
          <input
            id="register-fullname"
            type="text"
            className={errors.fullName ? 'is-invalid' : ''}
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={handleChange('fullName')}
          />
        </div>
        {errors.fullName && <p className="auth-error-text">{errors.fullName}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="register-email">Email</label>
        <div className="auth-input-wrap">
          <input
            id="register-email"
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
        <label htmlFor="register-phone">Số điện thoại</label>
        <div className="auth-input-wrap">
          <input
            id="register-phone"
            type="tel"
            className={errors.phone ? 'is-invalid' : ''}
            placeholder="0901234567"
            value={formData.phone}
            onChange={handleChange('phone')}
          />
        </div>
        {errors.phone && <p className="auth-error-text">{errors.phone}</p>}
      </div>

      <div className="auth-field">
        <label htmlFor="register-password">Mật khẩu</label>
        <div className="auth-input-wrap">
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            className={errors.password ? 'is-invalid' : ''}
            placeholder="Tối thiểu 6 ký tự"
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

      <div className="auth-field">
        <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
        <div className="auth-input-wrap">
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            className={errors.confirmPassword ? 'is-invalid' : ''}
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
          />
          <button
            type="button"
            className="auth-toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.confirmPassword && <p className="auth-error-text">{errors.confirmPassword}</p>}
      </div>

      <div className="auth-field">
        <div className="auth-checkbox">
          <input
            type="checkbox"
            id="agree-terms"
            checked={formData.agreeTerms}
            onChange={handleChange('agreeTerms')}
          />
          <label htmlFor="agree-terms">
            Tôi đồng ý với <span className="auth-link">điều khoản sử dụng</span>
          </label>
        </div>
        {errors.agreeTerms && <p className="auth-error-text">{errors.agreeTerms}</p>}
      </div>

      <button type="submit" className="auth-submit-btn">
        Đăng ký
      </button>

      <p className="auth-footer-text mt-3">
        Đã có tài khoản?{' '}
        <Link to="/login" className="auth-link">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}

export default RegisterForm
