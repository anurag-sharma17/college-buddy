import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import TeacherService from '../TeacherService';
import './css/TeacherView.css';

function TeacherView() {
  const { currentUser } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cabinNo: '',
    phone: '',
    available: true,
    employeeId: ''
  });

  const [timetable, setTimetable] = useState([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    time: '09:00-10:00',
    course: '',
    location: ''
  });

  const [timetableImage, setTimetableImage] = useState(null);
  const [timetableImagePreview, setTimetableImagePreview] = useState(null);
  const [timetableDisplayMode, setTimetableDisplayMode] = useState('manual');

  // Initialize theme
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

  // Fetch teacher profile
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      if (!currentUser) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const teacherData = await TeacherService.getTeacher(currentUser.email);
        setTeacherProfile(teacherData);
        setFormData({
          name: teacherData.name || '',
          email: teacherData.email || '',
          cabinNo: teacherData.cabinNo || '',
          phone: teacherData.phone || '',
          available: teacherData.available !== undefined ? teacherData.available : true,
          employeeId: teacherData.employeeId || ''
        });
        setTimetable(teacherData.timetable || []);
        setTimetableDisplayMode(teacherData.timetableDisplayMode || 'manual');
        if (teacherData.timetableImage) {
          setTimetableImage(teacherData.timetableImage);
          setTimetableImagePreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${teacherData.timetableImage}`);
        }
      } catch (err) {
        console.error('Error loading teacher profile:', err.message, err.response?.data);
        if (err.message.includes('Teacher not found')) {
          try {
            const newTeacher = await TeacherService.addTeacher({
              name: currentUser.name,
              email: currentUser.email,
              employeeId: `EMP${Date.now()}`, // Generate temporary employeeId
              cabinNo: '',
              phone: '',
              available: true,
              timetable: [],
              timetableImage: null,
              timetableDisplayMode: 'manual'
            });
            setTeacherProfile(newTeacher);
            setFormData({
              name: newTeacher.name || '',
              email: newTeacher.email || '',
              cabinNo: newTeacher.cabinNo || '',
              phone: newTeacher.phone || '',
              available: newTeacher.available,
              employeeId: newTeacher.employeeId || ''
            });
            setTimetable(newTeacher.timetable || []);
            setTimetableDisplayMode(newTeacher.timetableDisplayMode || 'manual');
          } catch (addErr) {
            console.error('Error creating new teacher:', addErr.message, addErr.response?.data);
            setError(addErr.message || 'Failed to create teacher profile');
          }
        } else {
          setError(err.message || 'Failed to load teacher profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [currentUser]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Toggle availability
  const handleToggleAvailability = async () => {
    if (!teacherProfile) return;

    try {
      const updatedTeacher = await TeacherService.toggleAvailability(teacherProfile.email);
      setTeacherProfile(updatedTeacher);
      setFormData({ ...formData, available: updatedTeacher.available });
      setError(null);
    } catch (err) {
      console.error('Error toggling availability:', err.message, err.response?.data);
      setError(err.message || 'Failed to toggle availability');
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!teacherProfile) return;

    try {
      const updatedTeacher = await TeacherService.updateTeacher(teacherProfile._id, {
        ...formData,
        timetable,
        timetableImage: teacherProfile.timetableImage,
        timetableDisplayMode
      });
      setTeacherProfile(updatedTeacher);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving profile:', err.message, err.response?.data);
      setError(err.message || 'Failed to save profile');
    }
  };

  // New slot input changes
  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  // Add timetable slot
  const handleAddSlot = async () => {
    if (!newSlot.course || !newSlot.location) {
      setError('Please fill in all fields for the new timetable slot');
      return;
    }

    try {
      const updatedTimetable = [...timetable, newSlot];
      setTimetable(updatedTimetable);

      if (teacherProfile) {
        const updatedTeacher = await TeacherService.updateTeacher(teacherProfile._id, {
          ...teacherProfile,
          timetable: updatedTimetable
        });
        setTeacherProfile(updatedTeacher);
      }

      setNewSlot({
        day: 'Monday',
        time: '09:00-10:00',
        course: '',
        location: ''
      });
      setShowAddSlot(false);
      setError(null);
    } catch (err) {
      console.error('Error adding timetable slot:', err.message, err.response?.data);
      setError(err.message || 'Failed to add timetable slot');
    }
  };

  // Delete timetable slot
  const handleDeleteSlot = async (index) => {
    try {
      const updatedTimetable = timetable.filter((_, i) => i !== index);
      setTimetable(updatedTimetable);

      if (teacherProfile) {
        const updatedTeacher = await TeacherService.updateTeacher(teacherProfile._id, {
          ...teacherProfile,
          timetable: updatedTimetable
        });
        setTeacherProfile(updatedTeacher);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting timetable slot:', err.message, err.response?.data);
      setError(err.message || 'Failed to delete timetable slot');
    }
  };

  // Handle timetable image selection
  const handleTimetableImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTimetableImage(file);
      setTimetableImagePreview(URL.createObjectURL(file));
    }
  };

  // Save timetable image
  const handleSaveTimetableImage = async () => {
    if (!teacherProfile || !timetableImage) return;

    try {
      const updatedTeacher = await TeacherService.uploadTimetableImage(teacherProfile.email, timetableImage);
      setTeacherProfile(updatedTeacher);
      setTimetableImage(updatedTeacher.timetableImage);
      setTimetableImagePreview(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${updatedTeacher.timetableImage}`);
      setError(null);
      alert('Timetable image saved successfully');
    } catch (err) {
      console.error('Error saving timetable image:', err.message, err.response?.data);
      setError(err.message || 'Failed to save timetable image');
    }
  };

  // Remove timetable image
  const handleRemoveTimetableImage = async () => {
    if (!teacherProfile) return;

    try {
      const updatedTeacher = await TeacherService.removeTimetableImage(teacherProfile.email);
      setTeacherProfile(updatedTeacher);
      setTimetableImage(null);
      setTimetableImagePreview(null);
      setError(null);
      alert('Timetable image removed successfully');
    } catch (err) {
      console.error('Error removing timetable image:', err.message, err.response?.data);
      setError(err.message || 'Failed to remove timetable image');
    }
  };

  // Handle display mode change
  const handleDisplayModeChange = async (mode) => {
    try {
      setTimetableDisplayMode(mode);
      if (teacherProfile) {
        const updatedTeacher = await TeacherService.updateTeacher(teacherProfile._id, {
          ...teacherProfile,
          timetableDisplayMode: mode
        });
        setTeacherProfile(updatedTeacher);
      }
      setError(null);
    } catch (err) {
      console.error('Error changing display mode:', err.message, err.response?.data);
      setError(err.message || 'Failed to change display mode');
    }
  };

  if (loading) {
    return (
      <div className="teacher-view">
        <div className="loading">Loading profile information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-view">
        <header>
          <Link to="/home" className="back-home-button">Back to Home</Link>
          <div className="logo">Teacher Portal</div>
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
          </div>
        </header>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div>
        <center><img src="/assets/MITADT.png" alt="MITADT" /></center>
      </div>
      <div className="teacher-view">
        <header>
          <Link to="/home" className="back-home-button">Back to Home</Link>
          <div className="logo">Teacher Portal</div>
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
            <div className="user-profile">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <span>{formData.name || 'Profile'}</span>
            </div>
          </div>
        </header>

        <div className="profile-container">
          <div className="profile-header">
            <h2>My Profile</h2>
            <div className="availability-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={handleToggleAvailability}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                {formData.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <button
              className="edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Cabin Number</label>
                <input
                  type="text"
                  name="cabinNo"
                  value={formData.cabinNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <button
                className="save-button"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{formData.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Employee ID:</span>
                <span className="detail-value">{formData.employeeId || 'Not specified'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{formData.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cabin Number:</span>
                <span className="detail-value">{formData.cabinNo || 'Not specified'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">{formData.phone || 'Not specified'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="timetable-container">
          <div className="timetable-header">
            <h2>My Timetable</h2>
            <div className="display-mode-toggle">
              <button
                className={`mode-button ${timetableDisplayMode === 'manual' ? 'active' : ''}`}
                onClick={() => handleDisplayModeChange('manual')}
              >
                Manual Entry
              </button>
              <button
                className={`mode-button ${timetableDisplayMode === 'image' ? 'active' : ''}`}
                onClick={() => handleDisplayModeChange('image')}
              >
                Image Upload
              </button>
            </div>
          </div>

          {timetableDisplayMode === 'manual' ? (
            <div className="manual-timetable-section">
              <div className="timetable-actions">
                <button
                  className="add-button"
                  onClick={() => setShowAddSlot(!showAddSlot)}
                >
                  {showAddSlot ? 'Cancel' : 'Add Slot'}
                </button>
              </div>

              {showAddSlot && (
                <div className="add-slot-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Day</label>
                      <select name="day" value={newSlot.day} onChange={handleNewSlotChange}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <select name="time" value={newSlot.time} onChange={handleNewSlotChange}>
                        {['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
                          '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Course</label>
                      <input
                        type="text"
                        name="course"
                        value={newSlot.course}
                        onChange={handleNewSlotChange}
                        placeholder="e.g. Introduction to Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={newSlot.location}
                        onChange={handleNewSlotChange}
                        placeholder="e.g. Room 101"
                      />
                    </div>
                  </div>
                  <button
                    className="save-button"
                    onClick={handleAddSlot}
                  >
                    Add to Timetable
                  </button>
                </div>
              )}

              <div className="timetable-list">
                {timetable.length === 0 ? (
                  <p className="no-timetable">No timetable entries yet. Add your first slot.</p>
                ) : (
                  <table className="timetable">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Course</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.day}</td>
                          <td>{slot.time}</td>
                          <td>{slot.course}</td>
                          <td>{slot.location}</td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteSlot(index)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="image-timetable-section">
              <div className="image-upload">
                <div className="form-group">
                  <label>Upload Timetable Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTimetableImageChange}
                    className="file-input"
                  />
                </div>

                {timetableImagePreview && (
                  <div className="image-preview">
                    <img src={timetableImagePreview} alt="Timetable" />
                  </div>
                )}

                <div className="image-actions">
                  <button
                    className="save-button"
                    onClick={handleSaveTimetableImage}
                    disabled={!timetableImage}
                  >
                    Save Timetable Image
                  </button>
                  {timetableImagePreview && (
                    <button
                      className="delete-button"
                      onClick={handleRemoveTimetableImage}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer>
          <p>© 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default TeacherView;
