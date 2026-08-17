import React from 'react';
import { FaRobot, FaAppleAlt, FaLeaf } from 'react-icons/fa';
import { BsBagFill, BsStars } from 'react-icons/bs';
import { GiCarrot, GiBroccoli } from 'react-icons/gi';
import './HeroIllustration.css';

const HeroIllustration = () => {
  return (
    <div className="hero-illustration-container">
      {/* Background Shapes */}
      <div className="hero-illu-bg-shape shape-1"></div>
      <div className="hero-illu-bg-shape shape-2"></div>

      <div className="hero-illu-content">
        {/* Logo Group */}
        <div className="hero-illu-logo-group">
          {/* Main Bag */}
          <BsBagFill className="logo-bag" />
          
          {/* Robot Face inside Bag */}
          <FaRobot className="logo-robot" />

          {/* Details */}
          <FaLeaf className="logo-leaf" />
          <BsStars className="logo-spark" />

          {/* Floating Food Icons */}
          <GiCarrot className="floating-icon icon-carrot" />
          <FaAppleAlt className="floating-icon icon-apple" />
          <GiBroccoli className="floating-icon icon-broccoli" />
        </div>

        {/* Text Group */}
        <div className="hero-illu-text-group">
          <div className="illu-brand">
            <span className="brand-foodshop">FoodShop</span>
            <span className="brand-ai">AI</span>
          </div>
          <div className="illu-slogan">Mua sắm nhanh • Thực phẩm sạch • AI tư vấn</div>
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;
