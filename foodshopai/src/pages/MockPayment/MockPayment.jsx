import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import { showToast } from '../../utils/toast';
import './MockPayment.css';

const MockPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get('paymentId');
  const amount = searchParams.get('amount') || 0;

  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      navigate('/checkout');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCancel(); // Hết giờ tự động hủy
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentId, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSuccess = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/payment/mock/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId })
      }).then(r => r.json());

      if (res.success) {
        showToast('Thanh toán thành công (Mock)', 'success');
        if (res.emailSent) {
          showToast('Email xác nhận đơn hàng đã được gửi', 'success');
        }
        navigate(`/order-success?orderId=${paymentId}`);
      } else {
        showToast(res.message || 'Lỗi xử lý', 'error');
        setIsProcessing(false);
      }
    } catch (err) {
      showToast('Lỗi kết nối', 'error');
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/payment/mock/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId })
      });
      showToast('Đã hủy giao dịch MoMo', 'error');
      navigate('/checkout?payment=failed');
    } catch (err) {
      navigate('/checkout?payment=failed');
    }
  };

  const formattedAmount = Number(amount).toLocaleString('vi-VN') + 'đ';

  return (
    <div className="momo-mock-container">
      <div className="momo-mock-card">
        {isProcessing && (
          <div className="momo-loading-overlay">
            <div className="momo-spinner"></div>
            <p>Đang xử lý giao dịch...</p>
          </div>
        )}

        <div className="momo-header">
          <div className="momo-logo">MoMo</div>
          <div className="momo-shield">
            <FaShieldAlt /> Thanh toán an toàn
          </div>
        </div>

        <div className="momo-body">
          <div className="momo-info-section">
            <div className="momo-merchant">FoodShopAI</div>
            <div className="momo-order-detail">
              <p>Mã đơn hàng: <strong>#{paymentId?.substring(0, 8)}...</strong></p>
              <p>Số tiền thanh toán:</p>
              <h2 className="momo-amount">{formattedAmount}</h2>
            </div>
          </div>

          <div className="momo-qr-section">
            <div className="momo-qr-wrapper">
              <QRCodeSVG
                value={`MOMO|FoodShopAI|${paymentId}|${amount}`}
                size={200}
                level={"H"}
                includeMargin={true}
                fgColor={"#A50064"}
              />
              <div className="momo-qr-icon"><FaMobileAlt /></div>
            </div>
            <p className="momo-scan-text">Sử dụng <strong>App MoMo</strong> hoặc ứng dụng Camera hỗ trợ QR code để quét mã.</p>

            <div className="momo-timer-box">
              Đơn hàng sẽ hết hạn sau: <span className="momo-timer">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="momo-actions">
            <button className="momo-btn momo-btn-success" onClick={handleSuccess} disabled={isProcessing}>
              Thanh toán thành công
            </button>
            <button className="momo-btn momo-btn-cancel" onClick={handleCancel} disabled={isProcessing}>
              Hủy giao dịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
