import { FaShippingFast, FaLeaf, FaTags, FaHeadset } from 'react-icons/fa'
import './FeatureSection.css'

// Danh sách 4 điểm mạnh - khai báo dạng mảng để tránh lặp JSX
const features = [
  {
    id: 1,
    icon: <FaShippingFast />,
    title: 'Giao hàng nhanh',
    description: 'Giao trong vòng 2 giờ tại nội thành, đảm bảo thực phẩm luôn tươi mới.',
  },
  {
    id: 2,
    icon: <FaLeaf />,
    title: 'Thực phẩm sạch',
    description: 'Nguồn gốc rõ ràng, kiểm định chất lượng nghiêm ngặt trước khi lên kệ.',
  },
  {
    id: 3,
    icon: <FaTags />,
    title: 'Giá tốt mỗi ngày',
    description: 'Cam kết giá cạnh tranh cùng nhiều chương trình ưu đãi hấp dẫn.',
  },
  {
    id: 4,
    icon: <FaHeadset />,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ tư vấn và trợ lý AI sẵn sàng hỗ trợ bạn mọi lúc.',
  },
]

/**
 * FeatureSection - Section "Tại sao chọn chúng tôi", trình bày 4 điểm mạnh chính.
 */
function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="section-container">
        <h2 className="section-heading">Tại sao chọn chúng tôi</h2>
        <p className="section-subheading">Những giá trị FoodShopAI cam kết mang lại cho bạn</p>

        <div className="feature-grid">
          {features.map((feature) => (
            <div className="feature-item" key={feature.id}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
