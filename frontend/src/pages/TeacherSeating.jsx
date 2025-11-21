import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TeacherSeating.css';
import { useAuth } from '../AuthContext';
import TeacherService from '../TeacherService';

function TeacherSeating() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    building: '',
    floor: '',
    roomNumber: '',
    email: '',
    phone: '',
    image: '',
    employeeId: '' // Added for backend compatibility
  });

  // Load theme and fetch teachers on component mount
  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    }

    // Fetch teachers
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TeacherService.getTeachers();
        // Map _id to id for compatibility
        const mappedTeachers = data.map(teacher => ({
          ...teacher,
          id: teacher._id
        }));
        setTeachers(mappedTeachers);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(err.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher => {
    return (
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle back button
  const handleBackClick = () => {
    navigate('/home');
  };

  // Open modal for adding new teacher
  const handleAddTeacher = () => {
    if (!currentUser || currentUser.type !== 'teacher') {
      alert('Only teachers can add new faculty members');
      return;
    }
    setEditingTeacher(null);
    setFormData({
      name: '',
      department: '',
      building: '',
      floor: '',
      roomNumber: '',
      email: '',
      phone: '',
      image: '',
      employeeId: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing teacher
  const handleEditTeacher = (teacher) => {
    if (!currentUser || currentUser.type !== 'teacher') {
      alert('Only teachers can edit faculty members');
      return;
    }
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      department: teacher.department || '',
      building: teacher.building || '',
      floor: teacher.floor || '',
      roomNumber: teacher.roomNumber || '',
      email: teacher.email,
      phone: teacher.phone || '',
      image: teacher.image || '',
      employeeId: teacher.employeeId || ''
    });
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTeacher) {
        // Update existing teacher
        const updatedTeacher = await TeacherService.updateTeacher(editingTeacher._id, formData);
        setTeachers(teachers.map(t => (t.id === editingTeacher.id ? { ...updatedTeacher, id: updatedTeacher._id } : t)));
      } else {
        // Add new teacher
        const newTeacher = await TeacherService.addTeacher(formData);
        setTeachers([...teachers, { ...newTeacher, id: newTeacher._id }]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving teacher:', err);
      alert(err.message || 'Failed to save teacher');
    }
  };

  return (
    <div>
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="teacher-seating-container">
        <header className="teacher-header">
          <div className="back-button" onClick={handleBackClick}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </div>
          <h1>Faculty Seating Arrangement</h1>
          <label className="theme-toggle">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
            <span className="toggle-slider"></span>
            <div className="toggle-icons">
              <i className="fas fa-sun"></i>
              <i className="fas fa-moon"></i>
            </div>
          </label>
        </header>

        <div className="search-filter-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, department, building, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {currentUser && currentUser.type === 'teacher' && (
            <div className="teacher-actions">
              <button className="add-teacher-btn" onClick={handleAddTeacher}>
                <i className="fas fa-plus"></i> Add Teacher
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading teachers...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="teacher-seating-grid">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map(teacher => (
                <div key={teacher.id} className="teacher-seating-card">
                  {currentUser && currentUser.type === 'teacher' && (
                    <button
                      className="edit-teacher-btn"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  <div className="teacher-photo">
                    {teacher.image ? (
                      <img src={teacher.image} alt={teacher.name} className="teacher-image" />
                    ) : (
                      <div className="photo-placeholder">
                        <i className="fas fa-user-tie"></i>
                      </div>
                    )}
                  </div>
                  <div className="teacher-seating-details">
                    <h3>{teacher.name}</h3>
                    <p><i className="fas fa-building"></i> Department: {teacher.department || 'Not specified'}</p>
                    <div className="location-info">
                      <p><i className="fas fa-map-marker-alt"></i> Building: {teacher.building || 'Not specified'}</p>
                      <p><i className="fas fa-door-open"></i> Room: {teacher.roomNumber || 'Not specified'}</p>
                    </div>
                    <div className="contact-info">
                      <p><i className="fas fa-envelope"></i> {teacher.email}</p>
                      <p><i className="fas fa-phone"></i> {teacher.phone || 'Not specified'}</p>
                    </div>
                    {teacher.notes && (
                      <p className="special-note">
                        <i className="fas fa-info-circle"></i> {teacher.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No faculty found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal for Add/Edit Teacher */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingTeacher ? 'Edit Teacher Information' : 'Add New Teacher'}</h2>
                <button className="close-modal" onClick={() => setIsModalOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="employeeId">Employee ID:</label>
                  <input
                    type="text"
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department:</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="building">Building:</label>
                    <input
                      type="text"
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="floor">Floor (optional):</label>
                    <input
                      type="text"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="roomNumber">Room Number:</label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL (optional):</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-buttons">
                  <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingTeacher ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherSeating;
