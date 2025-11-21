import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import ChatbotWelcome from "./ChatbotWelcome";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your college assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      }));

      const response = await fetch("http://localhost:5000/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const assistantMessage = {
          role: "assistant",
          content: data.response,
          timestamp: data.timestamp,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.details || data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);

      // More specific error messages
      let errorText = "Sorry, I'm having trouble connecting right now.";

      if (error.message.includes("API key")) {
        errorText =
          "⚠️ API key issue detected. Please check the backend configuration.";
      } else if (error.message.includes("quota")) {
        errorText = "⚠️ API quota exceeded. Please try again later.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
      ) {
        errorText =
          "⚠️ Network error. Please check your connection and make sure the backend server is running.";
      } else if (error.message.includes("401")) {
        errorText = "⚠️ Authentication error. Please log in again.";
      } else if (error.message) {
        errorText = `⚠️ Error: ${error.message}`;
      } else {
        errorText += " Please try again later.";
      }

      const errorMessage = {
        role: "assistant",
        content: errorText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Welcome Modal */}
      <ChatbotWelcome />

      {/* Floating Chat Button */}
      <div
        className={`chatbot-floating-button ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        title="Chat with AI Assistant"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="28"
            height="28"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="28"
            height="28"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            <path d="M7 9h10v2H7zm0-3h10v2H7z" />
          </svg>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24"
                  height="24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <div>
                <h3>AI Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={toggleChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
