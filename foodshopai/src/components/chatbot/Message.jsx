import { useState } from 'react';
import './Message.css';
import { FiUser, FiCpu, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/getImageUrl';
import { showToast } from '../../utils/toast';

const Message = ({ text, sender, time, products = [] }) => {
  const isUser = sender === 'user';
  const { addMultipleToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddAll = async () => {
    setIsAdding(true);
    // Check out of stock beforehand
    const outOfStockItems = products.filter(p => p.stock === 0 || p.quantity > p.stock);
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach(p => {
        showToast(`Sản phẩm ${p.name} hiện đã hết hàng hoặc không đủ số lượng.`, 'error');
      });
      // Optionally still add the ones in stock, but here we just block the whole action for safety or add valid ones
      // Let's filter valid ones
    }
    
    const validProducts = products.filter(p => p.stock > 0 && p.quantity <= p.stock);
    
    if (validProducts.length > 0) {
      const res = await addMultipleToCart(validProducts);
      if (res.success) {
        setAdded(true);
        showToast('Đã thêm các sản phẩm hợp lệ vào giỏ hàng!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    }
    setIsAdding(false);
  };

  return (
    <div className={`chatbot-message ${isUser ? 'user' : 'ai'}`}>
      <div className={`chatbot-avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? <FiUser /> : <FiCpu />}
      </div>
      <div className="chatbot-bubble">
        {text}
        
        {products && products.length > 0 && !isUser && (
          <div className="chatbot-products-list mt-2">
            <div className="d-flex flex-column gap-2">
              {products.map((p, idx) => (
                <div key={idx} className="chatbot-product-item d-flex align-items-center gap-2 p-2 border rounded" style={{ backgroundColor: '#fff', color: '#000' }}>
                  <img src={getImageUrl(p.image) || 'https://placehold.co/50x50'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div className="flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>
                    <div className="fw-bold">{p.name}</div>
                    <div className="text-danger">{p.price?.toLocaleString()}đ x {p.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className={`btn btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-2 ${added ? 'btn-success' : 'btn-primary'}`} 
              onClick={handleAddAll}
              disabled={isAdding || added}
            >
              {added ? <><FiCheck /> Đã thêm vào giỏ</> : (isAdding ? 'Đang thêm...' : <><FiShoppingCart /> Thêm tất cả vào giỏ</>)}
            </button>
          </div>
        )}

        <span className="chatbot-time">{time}</span>
      </div>
    </div>
  );
};

export default Message;
