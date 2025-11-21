import React, { useEffect } from 'react';
import './WelcomePopup.css'; // Make sure this CSS file exists in the same directory

function WelcomePopup({ onClose }) {
  // Create floating graduation caps animation inside the popup
  useEffect(() => {
    const popupContent = document.querySelector('.popup-content');
    if (!popupContent) return;
    
    const floatingCapsContainer = document.createElement('div');
    floatingCapsContainer.className = 'floating-caps';
    popupContent.appendChild(floatingCapsContainer);
    
    // Array of colors for the caps
    const colors = ['#2196f3', '#ff5722', '#4caf50', '#9c27b0', '#ff9800', '#e91e63'];
    
    // Create multiple graduation caps
    const numberOfCaps = 60;
    for (let i = 0; i < numberOfCaps; i++) {
      const cap = document.createElement('div');
      cap.className = 'floating-cap';
      
      // Random positions within the popup content
      cap.style.left = `${Math.random() * 100}%`;
      cap.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = 15 + Math.random() * 20;
      cap.style.width = `${size}px`;
      cap.style.height = `${size}px`;
      
      // Random animation duration
      const duration = 8 + Math.random() * 12;
      cap.style.animationDuration = `${duration}s`;
      
      // Random animation delay
      cap.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random color from our color array
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      cap.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='20' height='20'%3E%3Cpath d='M50 15L20 30L50 45L80 30L50 15ZM30 40V55L50 65L70 55V40L50 50L30 40ZM35 45V50L50 57.5L65 50V45L50 52.5L35 45Z' fill='${randomColor.replace('#', '%23')}' opacity='0.7'/%3E%3C/svg%3E")`;
      
      floatingCapsContainer.appendChild(cap);
    }
    
    // Cleanup on component unmount
    return () => {
      if (popupContent.contains(floatingCapsContainer)) {
        popupContent.removeChild(floatingCapsContainer);
      }
    };
  }, []);
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="welcome-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Welcome to College Buddy!</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="popup-content">
          <div className="welcome-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2>Thanks for logging in!</h2>
          <p>
            We're excited to have you here. College Buddy is your ultimate companion for navigating 
            campus life at MIT ADT University. Explore our features to make the most of your college experience.
          </p>
          
          <button className="get-started-btn" onClick={onClose}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePopup;