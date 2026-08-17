import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import chatService from '../../services/chatService';
import './ChatBot.css';

const QUICK_SUGGESTIONS = [
  "🥩 Tôi muốn nấu lẩu",
  "🍲 Gợi ý bữa tối",
  "🥗 Tôi đang giảm cân",
  "🍎 Thực phẩm tốt cho trẻ em",
  "💰 Mua trong 300.000đ",
  "🛒 Gợi ý thực đơn"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUnopenedBubble, setShowUnopenedBubble] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowUnopenedBubble(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (textOverride) => {
    const textToSend = typeof textOverride === 'string' ? textOverride.trim() : inputText.trim();
    if (!textToSend) return;

    const newUserMsg = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(textToSend);
      if (res && res.data) {
        const newAiMsg = {
          id: Date.now() + 1,
          text: res.data.reply,
          products: res.data.products || [],
          sender: 'ai',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newAiMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Xin lỗi, hiện tại AI đang bận. Vui lòng thử lại.',
        sender: 'ai',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Tránh xuống dòng
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-header-icon">
                <FaRobot />
              </div>
              <div>
                <h3 className="chatbot-header-title">FoodShop AI</h3>
                <p className="chatbot-header-subtitle">Online</p>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={handleToggle}>
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="chatbot-body">
            {messages.length === 0 ? (
              <>
                <div className="chatbot-empty-state">
                  <FaRobot className="chatbot-empty-icon" />
                  <div className="chatbot-empty-text">
                    Tôi là FoodShop AI.<br/>
                    Hãy hỏi tôi về thực phẩm, món ăn hoặc ngân sách.
                  </div>
                </div>
                <div className="chatbot-suggestions">
                  {QUICK_SUGGESTIONS.map((sug, idx) => (
                    <div 
                      key={idx} 
                      className="chatbot-suggestion-chip" 
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              messages.map((msg) => (
                <Message key={msg.id} text={msg.text} sender={msg.sender} time={msg.time} products={msg.products} />
              ))
            )}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <textarea
              className="chatbot-input"
              placeholder="Hỏi món ăn, nguyên liệu hoặc ngân sách..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              rows="1"
              style={{ resize: 'none', overflowY: 'auto', minHeight: '44px', maxHeight: '100px' }}
            />
            <button 
              className="chatbot-send-btn" 
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button and Unopened Bubble */}
      {!isOpen && (
        <div className="chatbot-toggle-wrapper">
          {showUnopenedBubble && (
            <div className="chatbot-unopened-bubble">
              <strong>👋 Xin chào!</strong><br />
              Tôi có thể giúp bạn tìm thực phẩm phù hợp.
            </div>
          )}
          <span className="chatbot-ai-badge">AI</span>
          <button className="chatbot-toggle-btn" onClick={handleToggle}>
            <FaRobot />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
