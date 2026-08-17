import AppRoutes from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

/**
 * App - Component gốc của toàn bộ ứng dụng.
 * Buổi 4: bọc thêm AuthProvider và CartProvider để toàn bộ ứng dụng có thể
 * dùng useAuth() / useCart() ở bất kỳ đâu (Header, Cart, Checkout, Profile...).
 * AuthProvider đặt ngoài cùng vì CartProvider không phụ thuộc vào Auth,
 * nhưng thứ tự này giúp dễ mở rộng sau này (ví dụ giỏ hàng theo từng user).
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
