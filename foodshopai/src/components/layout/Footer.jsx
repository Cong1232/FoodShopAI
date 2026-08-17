import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import './Footer.css'

/**
 * Footer - Chân trang, hiển thị ở mọi trang thông qua MainLayout.
 * Gồm 4 khối: Giới thiệu, Danh mục, Liên hệ, Mạng xã hội + dòng Copyright.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  // Danh mục nhanh - dữ liệu tĩnh, sau này có thể lấy từ API danh mục
  const categories = ['Rau củ quả', 'Thịt tươi sống', 'Hải sản', 'Đồ khô - Gia vị', 'Đồ uống']

  return (
    <footer className="site-footer">
      <div className="section-container footer-grid">
        {/* ===== Giới thiệu ===== */}
        <div className="footer-col">
          <div className="footer-logo">
            <span className="logo-food">Food</span>
            <span className="logo-shop-white">Shop</span>
            <span className="logo-ai">AI</span>
          </div>
          <p className="footer-text">
            Website bán thực phẩm trực tuyến, tích hợp Chatbot AI hỗ trợ tư vấn
            và tìm kiếm sản phẩm thông minh, mang đến trải nghiệm mua sắm nhanh
            chóng và tiện lợi.
          </p>
        </div>

        {/* ===== Danh mục ===== */}
        <div className="footer-col">
          <h6 className="footer-title">Danh mục</h6>
          <ul className="footer-list">
            {categories.map((item) => (
              <li key={item}>
                <Link to="/products">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Liên hệ ===== */}
        <div className="footer-col">
          <h6 className="footer-title">Liên hệ</h6>
          <ul className="footer-contact">
            <li>
              <FiMapPin /> <span>123 Đường Nguyễn Văn A, Q.1, TP.HCM</span>
            </li>
            <li>
              <FiPhone /> <span>0123 456 789</span>
            </li>
            <li>
              <FiMail /> <span>support@foodshopai.vn</span>
            </li>
          </ul>
        </div>

        {/* ===== Mạng xã hội ===== */}
        <div className="footer-col">
          <h6 className="footer-title">Kết nối với chúng tôi</h6>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Youtube"><FaYoutube /></a>
            <a href="#" aria-label="Tiktok"><FaTiktok /></a>
          </div>
        </div>
      </div>

      {/* ===== Copyright ===== */}
      <div className="footer-bottom">
        <p>© {currentYear} FoodShopAI. Đồ án tốt nghiệp - Đại học. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
