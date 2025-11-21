import React, { useState, useEffect } from "react";
import "./ChatbotWelcome.css";

const ChatbotWelcome = ({ onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome message before
    const hasSeenWelcome = localStorage.getItem("chatbot_welcome_seen");
    if (!hasSeenWelcome) {
      setTimeout(() => setShow(true), 1000); // Show after 1 second
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("chatbot_welcome_seen", "true");
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <div className="chatbot-welcome-overlay" onClick={handleClose}>
      <div
        className="chatbot-welcome-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chatbot-welcome-header">
          <div className="chatbot-welcome-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="32"
              height="32"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h3>Meet Your AI Assistant! 🤖</h3>
        </div>

        <div className="chatbot-welcome-body">
          <p className="chatbot-welcome-intro">
            I'm here to help you with anything related to:
          </p>

          <ul className="chatbot-welcome-list">
            <li>
              <span className="icon">📚</span>
              <span>Study groups and academic resources</span>
            </li>
            <li>
              <span className="icon">👨‍🏫</span>
              <span>Teacher availability and schedules</span>
            </li>
            <li>
              <span className="icon">🎭</span>
              <span>College clubs and activities</span>
            </li>
            <li>
              <span className="icon">🚌</span>
              <span>Transport and campus facilities</span>
            </li>
            <li>
              <span className="icon">🎓</span>
              <span>Alumni connections</span>
            </li>
            <li>
              <span className="icon">📞</span>
              <span>Important contacts and more!</span>
            </li>
          </ul>

          <div className="chatbot-welcome-tip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <span>
              Click the <strong>purple chat icon</strong> in the bottom-right
              corner anytime!
            </span>
          </div>
        </div>

        <div className="chatbot-welcome-footer">
          <button className="chatbot-welcome-button" onClick={handleClose}>
            Got it! Let's chat 💬
          </button>
        </div>

        <button className="chatbot-welcome-close" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="20"
            height="20"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatbotWelcome;
