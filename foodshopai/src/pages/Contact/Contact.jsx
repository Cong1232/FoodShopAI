import { useState } from 'react';
import { FiMapPin, FiPhoneCall, FiMail, FiSend } from 'react-icons/fi';
import { showToast } from '../../utils/toast';
import './Contact.scss';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi form thành công
    showToast('Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất!', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <section className="contact-banner">
        <h1 className="banner-title">Liên hệ với chúng tôi</h1>
        <p className="banner-desc">
          Bạn có câu hỏi, thắc mắc hay cần hỗ trợ? Đừng ngần ngại liên hệ với FoodShopAI. 
          Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và phản hồi trong thời gian sớm nhất.
        </p>
      </section>

      {/* Main Content */}
      <section className="contact-container">
        {/* Thông tin liên hệ */}
        <div className="contact-info">
          <h2>Hãy để lại lời nhắn</h2>
          <p>
            FoodShopAI luôn mong muốn mang đến trải nghiệm tốt nhất cho bạn. 
            Nếu có bất kỳ ý kiến đóng góp hay sự cố nào, xin vui lòng liên hệ qua các kênh dưới đây.
          </p>
          
          <div className="info-list">
            <div className="info-item">
              <div className="icon-box"><FiMapPin /></div>
              <div className="info-content">
                <h4>Trụ sở chính</h4>
                <span>123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><FiPhoneCall /></div>
              <div className="info-content">
                <h4>Hotline 24/7</h4>
                <span>1900 8888 (Miễn cước gọi)</span>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><FiMail /></div>
              <div className="info-content">
                <h4>Email Hỗ trợ</h4>
                <span>support@foodshopai.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="contact-form-wrapper">
          <h3>Gửi tin nhắn cho chúng tôi</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input 
                type="text" 
                name="name"
                placeholder="Nhập họ tên của bạn" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email"
                placeholder="Nhập địa chỉ email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Tiêu đề</label>
              <input 
                type="text" 
                name="subject"
                placeholder="Vấn đề bạn cần hỗ trợ là gì?" 
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Nội dung *</label>
              <textarea 
                name="message"
                placeholder="Mô tả chi tiết nội dung cần liên hệ..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn-submit">
              <FiSend /> Gửi Tin Nhắn
            </button>
          </form>
        </div>
      </section>

      {/* Bản đồ */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197204!2d106.69838031533443!3d10.77109609232497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a6028c!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1629881234567!5m2!1svi!2s"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="FoodShopAI Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
