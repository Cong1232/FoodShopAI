import { FaRobot } from 'react-icons/fa';
import './TypingIndicator.css';

const TypingIndicator = () => {
  return (
    <div className="chatbot-message ai" style={{ marginBottom: '16px', alignItems: 'flex-end', animation: 'messageSlideUp 0.3s ease-out backwards' }}>
      <div className="chatbot-avatar ai">
        <FaRobot />
      </div>
      <div className="chatbot-bubble typing-bubble">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
