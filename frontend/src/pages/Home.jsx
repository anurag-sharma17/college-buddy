import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import WelcomePopup from "./WelcomePopup";

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showTeacherOptionsPopup, setShowTeacherOptionsPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showResourcePopup, setShowResourcePopup] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout, isNewLogin, resetNewLoginFlag } = useAuth();

  // Check if this is a new login to show welcome popup
  useEffect(() => {
    console.log("Checking isNewLogin:", isNewLogin);
    if (isNewLogin) {
      console.log("New login detected, showing welcome popup");
      setShowWelcomePopup(true);
    }
  }, [isNewLogin]);

  const handleCloseWelcomePopup = () => {
    console.log("Closing welcome popup");
    setShowWelcomePopup(false);
    resetNewLoginFlag(); // Reset the flag in auth context
  };
  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        setIsDarkMode(true);
      }
    }
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  // Handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Feature card click handler
  const handleFeatureCardClick = (title, isButton) => {
    if (!isButton) {
      if (title === "Teacher Availability") {
        handleTeacherButtonClick();
      }
    }
  };

  const handleClick = () => {
    if (!currentUser) {
      navigate("/login");
    }
  };

  // Handle teacher button click
  const handleTeacherButtonClick = (e) => {
    if (e) e.stopPropagation(); // Prevent card click event
    setShowTeacherOptionsPopup(true);
  };

  // Handle map button click
  const handleMapButtonClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    setShowMapPopup(true);
  };

  const campusMapImages = [
    { src: "/assets/campus-map.jpg", alt: "MIT ADT Campus Map - Main View" },
    {
      src: "/assets/campus-map-2.jpg",
      alt: "MIT ADT Campus Map - Academic Buildings",
    },
    { src: "/assets/campus-map-3.jpg", alt: "MIT ADT Campus Map " },
    { src: "/assets/campus-map-4.jpg", alt: "MIT ADT Campus Map " },
  ];

  // Functions to handle image navigation
  const goToPreviousImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? campusMapImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === campusMapImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle map option selection
  const handleMapOptionClick = (option, e) => {
    e.stopPropagation(); // Prevent card click event

    if (option === "explore360") {
      // Open 360 degree campus tour in new tab
      window.open("https://mituniversity.ac.in/virtualtour/", "_blank");
      setShowMapPopup(false);
    } else if (option === "showImage") {
      // Close the options popup and show the image popup
      setShowMapPopup(false);
      setShowImagePopup(true);
    }
  };

  // Handle teacher option selection
  const handleTeacherOptionClick = (option, e) => {
    e.stopPropagation(); // Prevent card click event

    if (option === "teacherInfo") {
      // Check if user is logged in
      if (currentUser) {
        navigate("/teacher-availability");
      } else {
        navigate("/login");
      }
      setShowTeacherOptionsPopup(false);
    } else if (option === "seatingArrangement") {
      // Navigate to seating arrangement page
      navigate("/teacher-seating");
      setShowTeacherOptionsPopup(false);
    }
  };

  // Close popups
  const handleClosePopup = () => {
    setShowMapPopup(false);
    setShowImagePopup(false);
    setShowTeacherOptionsPopup(false);
  };

  // Function to determine if a card should be visible based on active tab
  const shouldShowCard = (cardName) => {
    if (activeTab === "Home") {
      return true; // Show all cards on Home tab
    }

    const tabCardMapping = {
      Schedule: ["Teacher Availability"],
      Clubs: ["College Clubs"],
      Resources: [
        "Resource Sharing",
        "Peer Study Groups",
        "Discussion Forums",
        "Alumni Connect",
      ], // Added 'Alumni Connect' to Resources tab
      Transport: ["Campus Transport"],
    };

    return tabCardMapping[activeTab]?.includes(cardName) || false;
  };

  // Card data to make rendering cleaner
  const featureCards = [
    {
      id: "interactive-map",
      title: "Interactive Campus Map",
      icon: "fas fa-map-marked-alt",
      color: "color1",
      description:
        "Never get lost again with our detailed interactive campus map featuring building floor plans, classroom locations, amenities, and accessibility routes. Search for specific locations and get directions from your current position.",
      buttonText: "Explore Map",
      hasCustomOptions: true,
    },
    {
      id: "teacher-availability",
      title: "Teacher Availability",
      icon: "fas fa-chalkboard-teacher",
      color: "color5",
      description:
        "Find the perfect time to meet with professors and teaching assistants with our real-time availability tracker. View office hours, book appointments, and receive reminders for upcoming meetings to maximize your academic support.",
      buttonText: "Find Teachers",
      hasCustomOptions: true,
      customHandler: handleTeacherButtonClick,
    },
    {
      id: "campus-transport",
      title: "Campus Transport",
      icon: "fas fa-bus",
      color: "color11",
      description:
        "Stay on schedule with real-time campus shuttle tracking, bus routes and timetables. Set notifications for your regular routes, view estimated arrival times, and plan your travels between campus locations efficiently and easily ",
      buttonText: "View All Routes",
      hasCustomOptions: true,
      customHandler: (e) => {
        e.stopPropagation();
        navigate("/Transport");
      },
    },
    {
      id: "college-clubs",
      title: "College Clubs",
      icon: "fas fa-users",
      color: "color3",
      description:
        "Discover and join vibrant campus clubs and organizations that match your interests. Browse club profiles, view past achievements, upcoming events, and connect with club leaders to enhance your college experience outside the classroom.",
      buttonText: "Explore Clubs",
      hasCustomOptions: true,
      customHandler: (e) => {
        e.stopPropagation();
        navigate("/clubs");
      },
    },
    {
      id: "resource-sharing",
      title: "Resource Sharing",
      icon: "fas fa-book",
      color: "color4",
      description:
        "Access a comprehensive library of academic resources including lecture notes, study guides, practice exams, and tutorials shared by students and faculty. Filter by course, subject, or professor to find exactly what you need for academic success.",
      buttonText: "Access Resources",
      hasCustomOptions: true, // Add this to indicate a custom handler
      customHandler: (e) => {
        e.stopPropagation();
        setShowResourcePopup(true); // Show the resource popup
      },
    },
    {
      id: "alumni-connect",
      title: "Alumni Connect",
      icon: "fas fa-user-graduate",
      color: "color7",
      description:
        "Connect with MIT ADT University graduates around the world. Build your strong professional network, find expert mentors, collaborate on projects, and explore exciting career opportunities through our thriving alumni community.",
      buttonText: "Connect Now",
      hasCustomOptions: true,
      customHandler: (e) => {
        e.stopPropagation();
        navigate("/alumni");
      },
    },
    {
      id: "peer-study-groups",
      title: "Peer Study Groups",
      icon: "fas fa-user-graduate",
      color: "color6",
      description:
        "Connect with fellow students for collaborative learning experiences. Create or join course-specific study groups, schedule sessions in available campus spaces, and share resources to boost your understanding and academic performance.",
      buttonText: "Join Groups",
      hasCustomOptions: true,
      customHandler: (e) => {
        e.stopPropagation();
        navigate("/study-groups");
      },
    },
    {
      id: "contact-info",
      title: "Contact Information",
      icon: "fas fa-address-book",
      color: "color8",
      description:
        "Quick access to essential campus contacts including department email addresses, faculty directories, administrative offices, social media handles, and emergency services. Save frequently used contacts for faster communication.",
      buttonText: "View Contacts",
      hasCustomOptions: true,
      customHandler: (e) => {
        e.stopPropagation();
        navigate("/contacts");
      },
    },
  ];

  return (
    <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      {/* Welcome Popup */}
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}

      <div className="container">
        <header>
          <div className="logo">
            <img
              src="/assets/MITADT.png"
              alt="MITADT"
              style={{
                height: "50px",
                marginRight: "15px",
                verticalAlign: "middle",
              }}
            />
            Welcome to College Buddy
          </div>
          <div className="header-controls">
            <label className="theme-toggle">
              <input
                type="checkbox"
                id="theme-toggle"
                checked={isDarkMode}
                onChange={handleThemeToggle}
              />
              <span className="toggle-slider"></span>
              <div className="toggle-icons">
                <i className="fas fa-sun"></i>
                <i className="fas fa-moon"></i>
              </div>
            </label>

            {/* Updated User Profile Section with Dropdown */}
            <div className="user-profile">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span onClick={handleClick} style={{ cursor: "pointer" }}>
                {currentUser ? currentUser.name : "Guest"}{" "}
              </span>
              {currentUser && (
                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="welcome-banner">
          <h2>
            Your ultimate companion. Everything you need for a successful
            college experience in one place.
          </h2>
        </div>

        <div className="nav-tabs">
          {["Home", "Schedule", "Clubs", "Resources", "Transport"].map(
            (tab) => (
              <div
                key={tab}
                className={`nav-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </div>
            )
          )}
        </div>

        <div className="features-grid">
          {featureCards.map(
            (card) =>
              shouldShowCard(card.title) && (
                <div
                  key={card.id}
                  className="feature-card"
                  onClick={(e) =>
                    handleFeatureCardClick(
                      card.title,
                      e.target.classList.contains("btn")
                    )
                  }
                >
                  <div className={`feature-card-header ${card.color}`}>
                    <i className={card.icon}></i>
                    <h3>{card.title}</h3>
                  </div>
                  <div className="feature-card-body">
                    <p>{card.description}</p>
                  </div>
                  <div className="feature-card-footer">
                    {card.hasCustomOptions ? (
                      <button
                        className="btn"
                        onClick={
                          card.title === "Interactive Campus Map"
                            ? handleMapButtonClick
                            : card.customHandler
                        }
                      >
                        {card.buttonText}
                      </button>
                    ) : (
                      <button className="btn">{card.buttonText}</button>
                    )}
                  </div>
                </div>
              )
          )}
        </div>

        {/* Map options popup */}
        {showMapPopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="map-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header color1">
                <h3>Select Map Option</h3>
                <button className="close-btn" onClick={handleClosePopup}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="popup-content">
                <div
                  className="map-option-card"
                  onClick={(e) => handleMapOptionClick("explore360", e)}
                >
                  <div className="option-icon">
                    <i className="fas fa-vr-cardboard"></i>
                  </div>
                  <div className="option-details">
                    <h4>Explore 360° Campus Tour</h4>
                    <p>
                      Experience an immersive virtual tour of our campus with
                      360-degree views
                    </p>
                  </div>
                </div>

                <div
                  className="map-option-card"
                  onClick={(e) => handleMapOptionClick("showImage", e)}
                >
                  <div className="option-icon">
                    <i className="fas fa-image"></i>
                  </div>
                  <div className="option-details">
                    <h4>Show Map Image</h4>
                    <p>
                      View a detailed campus map with building names, pathways,
                      and facilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teacher options popup */}
        {showTeacherOptionsPopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="map-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header color5">
                <h3>Select Teacher Option</h3>
                <button className="close-btn" onClick={handleClosePopup}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="popup-content">
                <div
                  className="map-option-card"
                  onClick={(e) => handleTeacherOptionClick("teacherInfo", e)}
                >
                  <div className="option-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="option-details">
                    <h4>Teacher Information</h4>
                    <p>
                      View detailed information about faculty members, their
                      office hours, and contact details
                    </p>
                  </div>
                </div>

                <div
                  className="map-option-card"
                  onClick={(e) =>
                    handleTeacherOptionClick("seatingArrangement", e)
                  }
                >
                  <div className="option-icon">
                    <i className="fas fa-chair"></i>
                  </div>
                  <div className="option-details">
                    <h4>Seating Arrangement</h4>
                    <p>
                      View the seating arrangements and the loations of all
                      faultu members
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map image popup */}
        {showImagePopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="image-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header color1">
                <h3>Campus Map</h3>
                <button className="close-btn" onClick={handleClosePopup}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="popup-content">
                <div className="campus-map-container">
                  <img
                    src={campusMapImages[currentImageIndex].src}
                    alt={campusMapImages[currentImageIndex].alt}
                    className="campus-map"
                  />

                  <div className="image-navigation">
                    <button onClick={goToPreviousImage}>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span>
                      {currentImageIndex + 1} / {campusMapImages.length}
                    </span>
                    <button onClick={goToNextImage}>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Options Popup */}
        {showResourcePopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="map-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header color4">
                <h3>Select Resource Category</h3>
                <button className="close-btn" onClick={handleClosePopup}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="popup-content">
                <div
                  className="map-option-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/resources/first-year");
                    setShowResourcePopup(false);
                  }}
                >
                  <div className="option-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="option-details">
                    <h4>First Year</h4>
                    <p>
                      Access study materials, notes, and resources for first
                      year courses
                    </p>
                  </div>
                </div>

                <div
                  className="map-option-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/resources/second-year");
                    setShowResourcePopup(false);
                  }}
                >
                  <div className="option-icon">
                    <i className="fas fa-book-reader"></i>
                  </div>
                  <div className="option-details">
                    <h4>Second Year</h4>
                    <p>Browse resources for second year subjects and courses</p>
                  </div>
                </div>

                <div
                  className="map-option-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/resources/specializations");
                    setShowResourcePopup(false);
                  }}
                >
                  <div className="option-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <div className="option-details">
                    <h4>Specializations</h4>
                    <p>
                      Resources for third and fourth year specialization tracks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="site-footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h4>About College Buddy</h4>
              <p>
                Your comprehensive campus companion designed to enhance your
                college experience at MIT ADT University.
              </p>
              <div className="contact">
                <p>
                  <i className="fas fa-map-marker-alt"></i> MIT ADT University,
                  Pune
                </p>
                <p>
                  <i className="fas fa-envelope"></i> contact@collegebuddy.com
                </p>
                <p>
                  <i className="fas fa-phone"></i> +91 98765 43210
                </p>
              </div>
            </div>

            <div className="footer-section links">
              <h4>Quick Links</h4>
              <ul>
                {/* Fixed href warnings by using buttons styled as links */}
                <li>
                  <button
                    className="link-button"
                    onClick={() => handleTabClick("Home")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className="link-button"
                    onClick={() => handleTabClick("Schedule")}
                  >
                    Schedule
                  </button>
                </li>
                <li>
                  <button
                    className="link-button"
                    onClick={() => handleTabClick("Clubs")}
                  >
                    Clubs
                  </button>
                </li>
                <li>
                  <button
                    className="link-button"
                    onClick={() => handleTabClick("Resources")}
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    className="link-button"
                    onClick={() => handleTabClick("Transport")}
                  >
                    Transport
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-section social">
              <h4>Connect With Us</h4>
              <div className="social-icons">
                {/* Fixed href warnings by using buttons styled as links with appropriate aria-labels */}
                <button className="social-button" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </button>
                <button className="social-button" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="social-button" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="social-button" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </button>
                <button className="social-button" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} College Buddy | MIT ADT
              University | All Rights Reserved
            </p>
            <div className="footer-bottom-links">
              <button className="link-button">Privacy Policy</button>
              <button className="link-button">Terms of Service</button>
              <button className="link-button">FAQ</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
