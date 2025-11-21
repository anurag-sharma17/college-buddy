import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import TeacherService from '../TeacherService';
import './css/StudentView.css';

// Base URL for backend (use environment variable or default to localhost:5000)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StudentView() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [timetableImage, setTimetableImage] = useState(null);
  const [timetableDisplayMode, setTimetableDisplayMode] = useState('manual');
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [timetableError, setTimetableError] = useState(null);
  const [activeDay, setActiveDay] = useState('');
  const [showBothTimetables, setShowBothTimetables] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize theme on component mount
  useEffect(() => {
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
  }, []);

  // Load teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await TeacherService.getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch timetable when a teacher is selected
  useEffect(() => {
    if (!selectedTeacher) return;

    const fetchTimetable = async () => {
      setTimetableLoading(true);
      setTimetableError(null);
      try {
        const teacherData = await TeacherService.getTeacher(selectedTeacher.email);
        console.log('Teacher data:', teacherData); // Debug teacher data
        if (teacherData) {
          const timetableData = teacherData.timetable || [];
          setTimetable(timetableData);
          if (timetableData.length > 0) {
            const days = [...new Set(timetableData.map(slot => slot.day))];
            setActiveDay(days[0]);
          }
          // Prepend BASE_URL to timetableImage if it exists
          const imageUrl = teacherData.timetableImage
            ? teacherData.timetableImage.startsWith('http')
              ? teacherData.timetableImage
              : `${BASE_URL}${teacherData.timetableImage}`
            : null;
          console.log('Timetable image URL:', imageUrl); // Debug image URL
          setTimetableImage(imageUrl);
          const hasManualEntries = timetableData && timetableData.length > 0;
          const hasImage = teacherData.timetableImage;
          if (hasManualEntries && hasImage) {
            setShowBothTimetables(true);
            setTimetableDisplayMode(teacherData.timetableDisplayMode || 'both');
          } else if (hasManualEntries) {
            setShowBothTimetables(false);
            setTimetableDisplayMode('manual');
          } else if (hasImage) {
            setShowBothTimetables(false);
            setTimetableDisplayMode('image');
          } else {
            setShowBothTimetables(false);
            setTimetableDisplayMode('manual');
          }
        } else {
          setTimetableError('No timetable available for this teacher');
        }
      } catch (error) {
        console.error('Error fetching teacher timetable:', error);
        setTimetableError('Failed to load teacher timetable');
      } finally {
        setTimetableLoading(false);
      }
    };

    fetchTimetable();
    const pollingInterval = setInterval(fetchTimetable, 60000);
    return () => clearInterval(pollingInterval);
  }, [selectedTeacher]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // Handle teacher selection
  const handleTeacherSelect = (teacher) => {
    if (selectedTeacher && selectedTeacher.email === teacher.email) {
      return;
    }
    setSelectedTeacher(teacher);
    setTimetable([]);
    setTimetableImage(null);
    setTimetableError(null);
    setActiveDay('');
    setShowBothTimetables(false);
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (teacher.subject && teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group timetable slots by day
  const timetableByDay = timetable.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {});

  // Get available days from timetable
  const days = Object.keys(timetableByDay);

  // Set active day handler
  const handleDayClick = (day) => {
    setActiveDay(day);
  };

  // Toggle timetable display mode
  const toggleTimetableMode = () => {
    if (timetableDisplayMode === 'image') {
      setTimetableDisplayMode('manual');
    } else if (timetableDisplayMode === 'manual') {
      setTimetableDisplayMode('image');
    } else {
      setTimetableDisplayMode('both');
    }
  };

  // Render the detailed timetable component
  const renderDetailedTimetable = () => {
    if (timetableLoading) {
      return <div className="loading">Loading teacher timetable...</div>;
    }
    if (timetableError) {
      return <div className="error-message">{timetableError}</div>;
    }
    return (
      <div className="student-timetable-view">
        <h3>Teacher's Timetable</h3>
        {showBothTimetables && (
          <div className="timetable-toggle">
            <button
              className="toggle-view-btn"
              onClick={toggleTimetableMode}
            >
              {timetableDisplayMode === 'image' ? 'Show Manual Schedule' :
               timetableDisplayMode === 'manual' ? 'Show Image Schedule' : 'Show Both Schedules'}
            </button>
          </div>
        )}
        {(timetableDisplayMode === 'image' || timetableDisplayMode === 'both') && timetableImage ? (
          <div className="timetable-image-container">
            <img
              src={timetableImage}
              alt="Teacher's Timetable"
              className="timetable-image"
              onError={(e) => {
                console.error('Failed to load timetable image:', timetableImage, e);
                e.target.src = '/assets/placeholder-timetable.png';
                setTimetableError(`Failed to load timetable image: ${timetableImage}`);
              }}
            />
          </div>
        ) : (
          (timetableDisplayMode === 'image' || timetableDisplayMode === 'both') && (
            <div className="timetable-image-container">
              <p className="error-message">No timetable image available.</p>
            </div>
          )
        )}
        {(timetableDisplayMode === 'manual' || timetableDisplayMode === 'both') && (
          <div className="manual-timetable-view">
            {timetable.length === 0 ? (
              <p className="no-timetable">No timetable entries available for this teacher.</p>
            ) : (
              <>
                <div className="timetable-days-nav">
                  {days.map(day => (
                    <button
                      key={day}
                      className={`day-tab ${activeDay === day ? 'active' : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="timetable-content">
                  {activeDay ? (
                    <div className="day-schedule">
                      <h4>{activeDay}'s Schedule</h4>
                      <div className="schedule-cards">
                        {timetableByDay[activeDay].map((slot, index) => (
                          <div key={index} className="schedule-card">
                            <div className="time-badge">{slot.time}</div>
                            <div className="course-info">
                              <h5>{slot.course}</h5>
                              <div className="location">
                                <span className="location-icon">📍</span>
                                {slot.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="select-day-prompt">Select a day to view schedule</p>
                  )}
                </div>
                <div className="view-full-timetable">
                  <button className="view-all-btn" onClick={() => setActiveDay('')}>
                    View Full Timetable
                  </button>
                  {!activeDay && (
                    <table className="timetable-grid">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Time</th>
                          <th>Course</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((slot, index) => (
                          <tr key={index}>
                            <td>{slot.day}</td>
                            <td>{slot.time}</td>
                            <td>{slot.course}</td>
                            <td>{slot.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="student-view">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div>
        <center><img src="/assets/MITADT.png" alt="MITADT" /></center>
      </div>
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search for teachers by name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={toggleDarkMode} style={{ marginTop: '10px', padding: '8px 16px', borderRadius: 'var(--border-radius)', background: 'transparent', border: '1px solid white', color: 'white', cursor: 'pointer' }}>
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading teachers...</div>
      ) : (
        <div className="teacher-list-container">
          <div className="teacher-list">
            <h2>Teachers</h2>
            {filteredTeachers.length > 0 ? (
              <ul>
                {filteredTeachers.map((teacher) => (
                  <li
                    key={teacher.email}
                    className={`teacher-item ${teacher.available ? 'available' : 'unavailable'} ${selectedTeacher?.email === teacher.email ? 'selected' : ''}`}
                    onClick={() => handleTeacherSelect(teacher)}
                  >
                    <span className="teacher-name">{teacher.name}</span>
                    <span className="teacher-status">
                      {teacher.available ? 'Available' : 'Unavailable'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-selection">No teachers found matching your search.</div>
            )}
          </div>
          <div className="teacher-detail">
            {selectedTeacher ? (
              <div className="teacher-card">
                <h2>{selectedTeacher.name}</h2>
                <div className="teacher-info">
                  <p><strong>Email:</strong> {selectedTeacher.email}</p>
                  <p><strong>Cabin Number:</strong> {selectedTeacher.cabinNo || 'Not specified'}</p>
                  <p><strong>Phone:</strong> {selectedTeacher.phone || 'Not specified'}</p>
                  <p><strong>Status:</strong>
                    <span
                      className="availability-badge"
                      style={{
                        backgroundColor: selectedTeacher.available ? '#10B981' : '#EF4444'
                      }}
                    >
                      {selectedTeacher.available ? 'Available' : 'Unavailable'}
                    </span>
                  </p>
                </div>
                {renderDetailedTimetable()}
              </div>
            ) : (
              <div className="no-selection">
                Select a teacher to view their details
              </div>
            )}
          </div>
        </div>
      )}
      <div className="back-home-container">
        <Link to="/home" className="back-home-button">Back to Home</Link>
      </div>
      <footer>
        <p>© 2025 College Buddy App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default StudentView;