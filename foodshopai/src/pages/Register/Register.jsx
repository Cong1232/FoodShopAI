import { Link } from 'react-router-dom'
import RegisterForm from './components/RegisterForm.jsx'

/**
 * Register - Trang đăng ký tài khoản.
 * Dùng chung layout "auth" (auth.css) với Login/ForgotPassword để đồng bộ giao diện.
 * Toàn bộ logic validate + xử lý đăng ký nằm trong RegisterForm.
 */
function Register() {
  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <Link to="/" className="auth-logo">
          <span className="logo-food">Food</span>
          <span className="logo-shop">Shop</span>
          <span className="logo-ai">AI</span>
        </Link>
        <p className="auth-subtitle">Tạo tài khoản để bắt đầu mua sắm cùng FoodShopAI</p>

        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
