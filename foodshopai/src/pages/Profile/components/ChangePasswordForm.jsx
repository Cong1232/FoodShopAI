import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import { isValidPassword } from '../../../utils/validators.js'

// Giá trị khởi tạo cho form đổi mật khẩu
const INITIAL_FORM = { oldPassword: '', newPassword: '', confirmPassword: '' }

/**
 * ChangePasswordForm - Form đổi mật khẩu, tách riêng khỏi form thông tin cá nhân
 * để Profile.jsx không bị phình to và dễ bảo trì hơn.
 */
function ChangePasswordForm() {
  const { changePassword } = useAuth()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setMessage({ type: '', text: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.'
    if (!isValidPassword(formData.newPassword)) newErrors.newPassword = 'Mật khẩu mới cần tối thiểu 6 ký tự.'
    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = changePassword(formData.oldPassword, formData.newPassword)
    if (!result.success) {
      setMessage({ type: 'error', text: result.message })
      return
    }

    setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' })
    setFormData(INITIAL_FORM)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="profile-form">
      {message.text && (
        <p className={message.type === 'success' ? 'profile-success-text' : 'profile-error-text'}>
          {message.text}
        </p>
      )}

      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="old-password">Mật khẩu hiện tại</label>
          <input
            id="old-password"
            type="password"
            className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
            value={formData.oldPassword}
            onChange={handleChange('oldPassword')}
          />
          {errors.oldPassword && <div className="profile-field-error">{errors.oldPassword}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="new-password">Mật khẩu mới</label>
          <input
            id="new-password"
            type="password"
            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
          />
          {errors.newPassword && <div className="profile-field-error">{errors.newPassword}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</label>
          <input
            id="confirm-new-password"
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
          />
          {errors.confirmPassword && <div className="profile-field-error">{errors.confirmPassword}</div>}
        </div>
      </div>

      <button type="submit" className="profile-submit-btn">
        Đổi mật khẩu
      </button>
    </form>
  )
}

export default ChangePasswordForm
