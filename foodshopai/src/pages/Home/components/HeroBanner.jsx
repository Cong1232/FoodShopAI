import { Link } from 'react-router-dom'
import HeroIllustration from './HeroIllustration'
import './HeroBanner.css'

/**
 * HeroBanner - Section banner lớn đầu Trang chủ.
 * Gồm: tiêu đề, mô tả ngắn, 2 nút hành động (Mua ngay / Xem sản phẩm)
 * và hình minh hoạ (placeholder, chưa có ảnh thật ở Buổi 2).
 */
function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="section-container hero-banner-inner">
        {/* ===== Nội dung văn bản ===== */}
        <div className="hero-banner-text">
          <span className="hero-banner-badge">Thực phẩm sạch • Giao nhanh • Tư vấn bằng AI</span>

          <h1 className="hero-banner-title">
            Thực phẩm <span className="hero-highlight">tươi ngon</span> mỗi ngày
          </h1>

          <p className="hero-banner-desc">
            Lựa chọn hàng nghìn sản phẩm thực phẩm tươi sạch, được kiểm định chất
            lượng và giao đến tận nhà. Được hỗ trợ tìm kiếm, tư vấn bởi trợ lý AI
            thông minh.
          </p>

          <div className="hero-banner-buttons">
            <Link to="/products" className="hero-btn hero-btn--primary">
              Mua ngay
            </Link>
            <Link to="/products" className="hero-btn hero-btn--outline">
              Xem sản phẩm
            </Link>
          </div>
        </div>

        {/* ===== Hình minh hoạ (Logo AI Illustration) ===== */}
        <div className="hero-banner-image">
          <HeroIllustration />
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
