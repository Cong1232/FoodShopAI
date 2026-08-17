import { Link } from 'react-router-dom'
import ForgotPasswordForm from './components/ForgotPasswordForm.jsx'

/**
 * ForgotPassword - Trang khôi phục mật khẩu.
 * Dùng chung layout "auth" với Login/Register để đồng bộ giao diện.
 */
function ForgotPassword() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-food">Food</span>
          <span className="logo-shop">Shop</span>
          <span className="logo-ai">AI</span>
        </Link>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword
