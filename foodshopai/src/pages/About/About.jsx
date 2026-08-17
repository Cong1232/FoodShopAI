import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, FiTruck, FiShield, FiClock, FiDollarSign, 
  FiMessageSquare, FiTarget, FiHeart, FiStar, FiAward
} from 'react-icons/fi';
import './About.scss';

// Hook cho counter animation
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return { count, ref };
};

// Component cho scroll animation fade in
const FadeInSection = ({ children }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`fade-in-scroll ${isVisible ? 'visible' : ''}`} ref={domRef}>
      {children}
    </div>
  );
};

function About() {
  const customers = useCounter(5000);
  const products = useCounter(1000);
  const orders = useCounter(20000);
  const satisfaction = useCounter(98);

  return (
    <div className="about-page">
      {/* 1. Banner */}
      <section className="about-banner">
        <h1 className="banner-title">Về FoodShopAI</h1>
        <p className="banner-desc">
          FoodShopAI là hệ thống bán thực phẩm trực tuyến ứng dụng AI giúp khách hàng 
          tìm kiếm và lựa chọn thực phẩm nhanh chóng, an toàn và tiện lợi.
        </p>
      </section>

      {/* 2. Giới thiệu cửa hàng */}
      <section className="about-section bg-light">
        <FadeInSection>
          <h2 className="section-title">Câu chuyện của chúng tôi</h2>
          <div className="intro-content">
            <div className="intro-card">
              <h3><FiStar /> Thành lập</h3>
              <p>Khởi nguồn từ mong muốn mang thực phẩm sạch đến mọi nhà, FoodShopAI ra đời vào năm 2023 với hệ thống quản lý chuẩn quốc tế.</p>
            </div>
            <div className="intro-card">
              <h3><FiTarget /> Sứ mệnh</h3>
              <p>Cung cấp thực phẩm an toàn, chất lượng cao, đồng thời ứng dụng công nghệ AI để tối ưu trải nghiệm mua sắm của người dùng.</p>
            </div>
            <div className="intro-card">
              <h3><FiHeart /> Tầm nhìn</h3>
              <p>Trở thành nền tảng cung ứng thực phẩm thông minh hàng đầu khu vực, kết nối trực tiếp từ nông trại đến bàn ăn.</p>
            </div>
            <div className="intro-card">
              <h3><FiAward /> Giá trị cốt lõi</h3>
              <p>Tận tâm - Trung thực - Đổi mới - An toàn. Mỗi sản phẩm trao đi là một lời cam kết về sức khỏe cộng đồng.</p>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 3. Tại sao chọn FoodShopAI */}
      <section className="about-section">
        <FadeInSection>
          <h2 className="section-title">Tại sao chọn FoodShopAI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-wrapper"><FiCheckCircle /></div>
              <h4>Thực phẩm tươi mỗi ngày</h4>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FiTarget /></div>
              <h4>Nguồn gốc rõ ràng</h4>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FiTruck /></div>
              <h4>Giao hàng nhanh</h4>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FiShield /></div>
              <h4>Thanh toán an toàn</h4>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FiMessageSquare /></div>
              <h4>Chatbot AI hỗ trợ 24/7</h4>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FiDollarSign /></div>
              <h4>Giá cả hợp lý</h4>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 4. Quy trình mua hàng */}
      <section className="about-section bg-light">
        <FadeInSection>
          <h2 className="section-title">Quy trình mua hàng</h2>
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-circle">1</div>
              <div className="step-title">Chọn sản phẩm</div>
            </div>
            <div className="timeline-step">
              <div className="step-circle">2</div>
              <div className="step-title">Thêm vào giỏ</div>
            </div>
            <div className="timeline-step">
              <div className="step-circle">3</div>
              <div className="step-title">Thanh toán</div>
            </div>
            <div className="timeline-step">
              <div className="step-circle">4</div>
              <div className="step-title">Đóng gói</div>
            </div>
            <div className="timeline-step">
              <div className="step-circle">5</div>
              <div className="step-title">Giao hàng</div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 5. Thống kê */}
      <section className="stats-section">
        <FadeInSection>
          <div className="stats-grid">
            <div className="stat-item" ref={customers.ref}>
              <div className="stat-number">{customers.count}+</div>
              <div className="stat-label">Khách hàng</div>
            </div>
            <div className="stat-item" ref={products.ref}>
              <div className="stat-number">{products.count}+</div>
              <div className="stat-label">Sản phẩm</div>
            </div>
            <div className="stat-item" ref={orders.ref}>
              <div className="stat-number">{orders.count}+</div>
              <div className="stat-label">Đơn hàng</div>
            </div>
            <div className="stat-item" ref={satisfaction.ref}>
              <div className="stat-number">{satisfaction.count}%</div>
              <div className="stat-label">Khách hàng hài lòng</div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 6. Đội ngũ */}
      <section className="about-section">
        <FadeInSection>
          <h2 className="section-title">Đội ngũ của chúng tôi</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" alt="CEO" />
              <div className="member-info">
                <h4>Nguyễn Văn A</h4>
                <p>Giám đốc điều hành (CEO)</p>
              </div>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" alt="CTO" />
              <div className="member-info">
                <h4>Trần Thị B</h4>
                <p>Giám đốc công nghệ (CTO)</p>
              </div>
            </div>
            <div className="team-member">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80" alt="CMO" />
              <div className="member-info">
                <h4>Lê Văn C</h4>
                <p>Trưởng phòng Marketing</p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 7. Cam kết */}
      <section className="about-section bg-light">
        <FadeInSection>
          <h2 className="section-title">Cam kết từ FoodShopAI</h2>
          <div className="commitments">
            <div className="commit-item">
              <FiShield className="commit-icon" />
              <div className="commit-text">Đảm bảo 100% an toàn vệ sinh thực phẩm</div>
            </div>
            <div className="commit-item">
              <FiDollarSign className="commit-icon" />
              <div className="commit-text">Hoàn tiền nếu sản phẩm lỗi hoặc không đúng chất lượng</div>
            </div>
            <div className="commit-item">
              <FiCheckCircle className="commit-icon" />
              <div className="commit-text">Đổi trả linh hoạt theo chính sách bảo hành</div>
            </div>
            <div className="commit-item">
              <FiClock className="commit-icon" />
              <div className="commit-text">Đội ngũ hỗ trợ 24/7 giải quyết khiếu nại siêu tốc</div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 8. CTA */}
      <section className="cta-section">
        <FadeInSection>
          <div className="cta-box">
            <h2>Khám phá hàng ngàn thực phẩm chất lượng ngay hôm nay</h2>
            <Link to="/products" className="btn-cta">Mua sắm ngay ➔</Link>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}

export default About;
