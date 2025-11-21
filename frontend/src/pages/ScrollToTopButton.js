// src/components/ScrollToTopButton.js
import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css'; // Create this CSS file with the styles I provided

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button 
      className={`scroll-to-top ${isVisible ? 'show' : 'hide'}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

export default ScrollToTopButton;