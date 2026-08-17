import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa'
import testimonialData from '../../../mock/testimonialData.js'
import './Testimonials.css'

/**
 * Testimonials - Section hiển thị đánh giá / cảm nhận của khách hàng.
 * Dữ liệu lấy từ mock/testimonialData.js (chưa gọi API).
 */
function Testimonials() {
  // Sinh 5 icon sao dựa trên rating nguyên (1-5) của từng khách hàng
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) =>
      index < rating ? <FaStar key={index} /> : <FaRegStar key={index} />,
    )

  return (
    <section className="testimonials">
      <div className="section-container">
        <h2 className="section-heading">Khách hàng nói gì</h2>
        <p className="section-subheading">Trải nghiệm thực tế từ những khách hàng đã sử dụng dịch vụ</p>

        <div className="testimonials-grid">
          {testimonialData.map((item) => (
            <div className="testimonial-card" key={item.id}>
              <FaQuoteLeft className="testimonial-quote-icon" />
              <p className="testimonial-comment">{item.comment}</p>

              <div className="testimonial-stars">{renderStars(item.rating)}</div>

              <div className="testimonial-author">
                <img src={item.avatar} alt={item.name} className="testimonial-avatar" />
                <div>
                  <h4 className="testimonial-name">{item.name}</h4>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
