import { Link } from 'react-router-dom'
import LoginForm from './components/LoginForm.jsx'

/**
 * Login - Trang đăng nhập.
 * Bố cục dùng chung style "auth" (xem assets/styles/auth.css) để đồng bộ
 * với Register và ForgotPassword. Toàn bộ logic nằm trong LoginForm.
 */
function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-food">Food</span>
          <span className="logo-shop">Shop</span>
          <span className="logo-ai">AI</span>
        </Link>
        <p className="auth-subtitle">Đăng nhập để tiếp tục mua sắm</p>

        <LoginForm />
      </div>
    </div>
  )
}

export default Login
