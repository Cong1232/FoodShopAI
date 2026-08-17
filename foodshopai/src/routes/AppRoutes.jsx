import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'

import Home from '../pages/Home/Home.jsx'
import Products from '../pages/Products/Products.jsx'
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx'
import Cart from '../pages/Cart/Cart.jsx'
import Checkout from '../pages/Checkout/Checkout.jsx'
import About from '../pages/About/About.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from '../pages/ResetPassword/ResetPassword.jsx'
import Profile from '../pages/Profile/Profile.jsx'
import Orders from '../pages/Orders/Orders.jsx'
import OrderDetail from '../pages/OrderDetail/OrderDetail.jsx'
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminRoute from './AdminRoute.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import Dashboard from '../pages/Admin/Dashboard/Dashboard.jsx'
import AdminProductList from '../pages/Admin/Products/AdminProductList.jsx'
import AdminCategoryList from '../pages/Admin/Categories/AdminCategoryList.jsx'
import AdminCategoryForm from '../pages/Admin/Categories/AdminCategoryForm.jsx'
import AdminOrderList from '../pages/Admin/Orders/AdminOrderList.jsx'
import AdminOrderDetail from '../pages/Admin/Orders/AdminOrderDetail.jsx'
import AdminUserList from '../pages/Admin/Users/AdminUserList.jsx'
import AdminUserDetail from '../pages/Admin/Users/AdminUserDetail.jsx'
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard.jsx'
import AdminReviewList from '../pages/Admin/Reviews/AdminReviewList.jsx'
import AdminReports from '../pages/Admin/Reports/AdminReports.jsx'
import AdminPlaceholder from '../pages/Admin/AdminPlaceholder.jsx'

import MockPayment from '../pages/MockPayment/MockPayment.jsx'

/**
 * AppRoutes - Khai báo toàn bộ đường dẫn (route) của ứng dụng.
 * Tất cả các trang đều nằm trong MainLayout (dùng chung Header + Footer),
 * ngoại trừ trường hợp sau này cần Layout riêng cho Admin thì tách route riêng.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/mock-payment" element={<MockPayment />} />

      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ */}
        <Route index element={<Home />} />

        {/* Sản phẩm */}
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* Giỏ hàng & thanh toán */}
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Tài khoản */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="my-orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="order-success" element={<OrderSuccess />} />
        </Route>

        {/* Route không tồn tại - luôn đặt cuối cùng */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="categories">
            <Route index element={<AdminCategoryList />} />
            <Route path="create" element={<AdminCategoryForm />} />
            <Route path=":id/edit" element={<AdminCategoryForm />} />
          </Route>
          <Route path="orders">
            <Route index element={<AdminOrderList />} />
            <Route path=":id" element={<AdminOrderDetail />} />
          </Route>
          <Route path="users">
            <Route index element={<AdminUserList />} />
            <Route path=":id" element={<AdminUserDetail />} />
          </Route>
          <Route path="reviews" element={<AdminReviewList />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
