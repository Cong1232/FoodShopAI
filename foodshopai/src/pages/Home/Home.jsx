import HeroBanner from './components/HeroBanner.jsx'
import CategorySection from './components/CategorySection.jsx'
import FlashSale from './components/FlashSale.jsx'
import FeaturedProducts from './components/FeaturedProducts.jsx'
import FeatureSection from './components/FeatureSection.jsx'
import Testimonials from './components/Testimonials.jsx'
import Newsletter from './components/Newsletter.jsx'

/**
 * Home - Trang chủ.
 * Buổi 2: ghép đầy đủ các section của Trang chủ. Toàn bộ logic hiển thị
 * được tách riêng thành từng component nhỏ trong thư mục ./components,
 * Home.jsx chỉ đóng vai trò sắp xếp thứ tự các section.
 *
 * Thứ tự hiển thị:
 * 1. HeroBanner       - Banner giới thiệu
 * 2. CategorySection  - Danh mục nổi bật
 * 3. FlashSale        - Sản phẩm giảm giá có giới hạn thời gian
 * 4. FeaturedProducts - Sản phẩm nổi bật
 * 5. FeatureSection   - Tại sao chọn chúng tôi
 * 6. Testimonials     - Khách hàng nói gì
 * 7. Newsletter       - Đăng ký nhận email ưu đãi
 * (Footer đã được xử lý ở MainLayout - Buổi 1)
 */
function Home() {
  return (
    <>
      <HeroBanner />
      <CategorySection />
      <FlashSale />
      <FeaturedProducts />
      <FeatureSection />
      <Testimonials />
      <Newsletter />
    </>
  )
}

export default Home
