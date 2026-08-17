import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import ChatBot from '../components/chatbot/ChatBot'

/**
 * MainLayout - Layout tổng dùng chung cho toàn bộ website (trừ Admin).
 * Cấu trúc: Header (cố định trên cùng) -> Nội dung trang (Outlet) -> Footer.
 * <Outlet /> là nơi React Router render component tương ứng với route con.
 */
function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 page-content">
        <Outlet />
      </main>

      <Footer />
      <ChatBot />
    </div>
  )
}

export default MainLayout
