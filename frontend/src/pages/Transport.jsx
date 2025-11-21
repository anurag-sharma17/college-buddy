import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import TransportService from '../TransportService';
import './css/Transport.css';

function Transport() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flippedStops, setFlippedStops] = useState({});
  const [pinnedRoutes, setPinnedRoutes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [busRoutes, setBusRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Initialize theme, pinned routes, and fetch bus routes
  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        setIsDarkMode(true);
      }
    }

    // Load pinned routes from localStorage if user is logged in
    if (currentUser) {
      const savedPinnedRoutes = localStorage.getItem(`pinnedRoutes_${currentUser.uid}`);
      if (savedPinnedRoutes) {
        setPinnedRoutes(JSON.parse(savedPinnedRoutes));
      }
    }

    // Fetch bus routes
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TransportService.getRoutes();
        // Map _id to id for compatibility
        const mappedRoutes = data.map(route => ({
          ...route,
          id: route._id
        }));
        setBusRoutes(mappedRoutes);
      } catch (err) {
        console.error('Error fetching routes:', err);
        setError(err.message || 'Failed to load bus routes');
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [currentUser]);

  // Effect to auto-expand routes when searching for stops
  useEffect(() => {
    if (searchTerm && busRoutes.length > 0) {
      const searchTermLower = searchTerm.toLowerCase();
      const routesWithMatchingStops = busRoutes.filter(route =>
        route.stops.some(stop => stop.location.toLowerCase().includes(searchTermLower))
      );
      if (routesWithMatchingStops.length > 0) {
        setSelectedRoute(routesWithMatchingStops[0].id);
      }
    }
  }, [searchTerm, busRoutes]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // Go back to home
  const goToHome = () => {
    navigate('/home');
  };

  // Select a route to view details
  const handleRouteSelect = (route) => {
    setSelectedRoute(route === selectedRoute ? null : route);
    if (route !== selectedRoute) {
      setFlippedStops({});
    }
  };

  // Toggle flip state for a stop
  const toggleFlip = (stopIndex) => {
    setFlippedStops(prevState => ({
      ...prevState,
      [stopIndex]: !prevState[stopIndex]
    }));
  };

  // Toggle all stops in a route
  const toggleAllStops = (routeId, showEvening) => {
    const route = busRoutes.find(r => r.id === routeId);
    if (!route) return;

    const newFlippedState = {};
    route.stops.forEach((_, index) => {
      newFlippedState[index] = showEvening;
    });
    setFlippedStops(newFlippedState);
  };

  // Toggle a route as pinned
  const togglePinRoute = (routeId) => {
    if (!currentUser) {
      alert('Please log in to pin routes');
      return;
    }

    let newPinnedRoutes;
    if (pinnedRoutes.includes(routeId)) {
      newPinnedRoutes = pinnedRoutes.filter(id => id !== routeId);
    } else {
      newPinnedRoutes = [...pinnedRoutes, routeId];
    }

    setPinnedRoutes(newPinnedRoutes);
    localStorage.setItem(`pinnedRoutes_${currentUser.uid}`, JSON.stringify(newPinnedRoutes));
  };

  // Check if a route is pinned
  const isRoutePinned = (routeId) => {
    return pinnedRoutes.includes(routeId);
  };

  // Filter routes based on unified search
  const filteredRoutes = busRoutes.filter(route => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      route.name.toLowerCase().includes(searchTermLower) ||
      route.stops.some(stop => stop.location.toLowerCase().includes(searchTermLower))
    );
  });

  // Get routes based on current filters and tab
  const getDisplayedRoutes = () => {
    let routes = filteredRoutes;
    if (activeTab === 'pinned') {
      routes = routes.filter(route => pinnedRoutes.includes(route.id));
    }
    return routes;
  };

  const displayedRoutes = getDisplayedRoutes();

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Highlight matching text in routes or stops
  const highlightMatch = (text) => {
    if (!searchTerm) return text;
    const searchTermLower = searchTerm.toLowerCase();
    if (text.toLowerCase().includes(searchTermLower)) {
      const index = text.toLowerCase().indexOf(searchTermLower);
      return (
        <>
          {text.substring(0, index)}
          <span className="highlighted-text">
            {text.substring(index, index + searchTerm.length)}
          </span>
          {text.substring(index + searchTerm.length)}
        </>
      );
    }
    return text;
  };

  return (
    <div className="page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="container">
        <header>
          <button className="back-home-button" onClick={goToHome}>
            Back To Home
          </button>
          <div className="logo">
            Campus Transport
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

            {currentUser && (
              <div className="user-info">
                <i className="fas fa-user"></i>
                <span>{currentUser.name}</span>
              </div>
            )}
          </div>
        </header>

        <div className="transport-container">
          <div className="search-filters">
            <div className="search-row">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search by route or stop name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="route-tabs">
            <button
              className={`route-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fas fa-list"></i> All Routes
            </button>
            <button
              className={`route-tab ${activeTab === 'pinned' ? 'active' : ''}`}
              onClick={() => setActiveTab('pinned')}
            >
              <i className="fas fa-thumbtack"></i> Pinned Routes
              {pinnedRoutes.length > 0 && <span className="pin-count">{pinnedRoutes.length}</span>}
            </button>
          </div>

          <div className="routes-container">
            <h3>
              {activeTab === 'all' ? (
                <><i className="fas fa-route"></i> Bus Routes</>
              ) : (
                <><i className="fas fa-thumbtack"></i> Pinned Routes</>
              )}
              {searchTerm && (
                <span className="search-info">
                  (Searching for "{searchTerm}")
                </span>
              )}
            </h3>

            {loading ? (
              <div className="loading">Loading bus routes...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : displayedRoutes.length === 0 ? (
              <div className="no-routes">
                <i className="fas fa-exclamation-circle"></i>
                {activeTab === 'pinned'
                  ? 'No pinned routes found. Pin your frequently used routes for quick access.'
                  : 'No routes found matching your criteria'}
              </div>
            ) : (
              displayedRoutes.map(route => (
                <div
                  key={route.id}
                  className={`route-card ${selectedRoute === route.id ? 'expanded' : ''}`}
                  style={{ borderLeft: `5px solid ${route.color}` }}
                >
                  <div
                    className="route-header"
                    onClick={() => handleRouteSelect(route.id)}
                  >
                    <div className="route-name">
                      <i className="fas fa-bus"></i> {highlightMatch(route.name)}
                    </div>
                    <div className="route-info">
                      <span>{route.stops.length} stops</span>
                      {currentUser && (
                        <button
                          className={`pin-route-btn ${isRoutePinned(route.id) ? 'pinned' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinRoute(route.id);
                          }}
                          title={isRoutePinned(route.id) ? 'Unpin this route' : 'Pin this route'}
                        >
                          <i className="fas fa-thumbtack"></i>
                        </button>
                      )}
                      <i className={`fas fa-chevron-${selectedRoute === route.id ? 'up' : 'down'}`}></i>
                    </div>
                  </div>

                  {selectedRoute === route.id && (
                    <div className="route-details">
                      <div className="schedule-toggle-buttons">
                        <button
                          className="schedule-toggle-btn morning-btn"
                          onClick={() => toggleAllStops(route.id, false)}
                        >
                          <i className="fas fa-sun"></i> Show All Morning
                        </button>
                        <button
                          className="schedule-toggle-btn evening-btn"
                          onClick={() => toggleAllStops(route.id, true)}
                        >
                          <i className="fas fa-moon"></i> Show All Evening
                        </button>
                      </div>

                      <div className="route-stops-container">
                        {route.stops.map((stop, index) => {
                          const isFlipped = flippedStops[index];
                          const hasEvening = !!stop.times.evening;
                          const isMatchingStop =
                            searchTerm &&
                            stop.location.toLowerCase().includes(searchTerm.toLowerCase());

                          return (
                            <div
                              className={`stop-card ${isMatchingStop ? 'highlighted-stop' : ''}`}
                              key={index}
                            >
                              <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                                <div className="flip-card-inner">
                                  <div className="flip-card-front">
                                    <div className="stop-marker">
                                      <div className="stop-point"></div>
                                      {index < route.stops.length - 1 && <div className="stop-line"></div>}
                                    </div>
                                    <div className="stop-details">
                                      <div className="stop-location">
                                        {highlightMatch(stop.location)}
                                      </div>
                                      <div className="time-content">
                                        <div className="time-info">
                                          <div className="time-section-header">
                                            <i className="fas fa-sun"></i> Morning
                                          </div>
                                          <div className="stop-time">{stop.times.morning}</div>
                                        </div>
                                        {hasEvening && (
                                          <button
                                            className="flip-button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleFlip(index);
                                            }}
                                          >
                                            <i className="fas fa-exchange-alt"></i> Evening
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {hasEvening && (
                                    <div className="flip-card-back">
                                      <div className="stop-marker">
                                        <div className="stop-point"></div>
                                        {index < route.stops.length - 1 && <div className="stop-line"></div>}
                                      </div>
                                      <div className="stop-details">
                                        <div className="stop-location">
                                          {highlightMatch(stop.location)}
                                        </div>
                                        <div className="time-content">
                                          <div className="time-info">
                                            <div className="time-section-header">
                                              <i className="fas fa-moon"></i> Evening
                                            </div>
                                            <div className="stop-time">{stop.times.evening}</div>
                                          </div>
                                          <button
                                            className="flip-button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleFlip(index);
                                            }}
                                          >
                                            <i className="fas fa-exchange-alt"></i> Morning
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <footer>
          <p>© 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Transport;
