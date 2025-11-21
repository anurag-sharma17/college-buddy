import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './css/FirstYear.css';

const YearSubjects = ({ year, title }) => {
  const [subjects, setSubjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    description: '',
    instructor: '',
    credits: '',
    documentLink: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const isTeacher = currentUser && currentUser.type === 'teacher';

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/subjects/${year}`, {
          withCredentials: true
        });
        setSubjects(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch subjects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [year]);

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleOpenDocument = (link) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('No document link available.');
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (newSubject.credits <= 0) {
      setError('Credits must be a positive number');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/subjects', {
        ...newSubject,
        credits: parseInt(newSubject.credits),
        year
      }, { withCredentials: true });
      setSubjects([...subjects, response.data]);
      setShowAddForm(false);
      setNewSubject({ name: '', code: '', description: '', instructor: '', credits: '', documentLink: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add subject');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    if (newSubject.credits <= 0) {
      setError('Credits must be a positive number');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/subjects/${editSubjectId}`, {
        ...newSubject,
        credits: parseInt(newSubject.credits),
        year
      }, { withCredentials: true });
      setSubjects(subjects.map(subject => subject._id === editSubjectId ? response.data : subject));
      setShowEditForm(false);
      setEditSubjectId(null);
      setNewSubject({ name: '', code: '', description: '', instructor: '', credits: '', documentLink: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update subject');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditSubject = (subject) => {
    setEditSubjectId(subject._id);
    setNewSubject({
      name: subject.name,
      code: subject.code || '',
      description: subject.description,
      instructor: subject.instructor || '',
      credits: subject.credits.toString(),
      documentLink: subject.documentLink || ''
    });
    setShowEditForm(true);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/subjects/${id}`, { withCredentials: true });
        setSubjects(subjects.filter(subject => subject._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete subject');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (subject.instructor && subject.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="container">
        <header>
          <button className="back-home-button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
          <div className="logo">{title}</div>
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
                {isTeacher && <span className="badge">Teacher</span>}
              </div>
            )}
          </div>
        </header>

        <div className="search-container">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}

        {isTeacher && (
          <div className="add-subject-button-container">
            <button className="add-subject-button" onClick={() => setShowAddForm(true)}>
              <i className="fas fa-plus"></i> Add New Subject
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="form-overlay">
            <div className="subject-form">
              <div className="form-header">
                <h2>Add New Subject</h2>
                <button className="close-form" onClick={() => setShowAddForm(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleAddSubject}>
                <div className="form-group">
                  <label>Subject Name:</label>
                  <input type="text" name="name" value={newSubject.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Subject Code:</label>
                  <input type="text" name="code" value={newSubject.code} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea name="description" value={newSubject.description} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Instructor:</label>
                  <input type="text" name="instructor" value={newSubject.instructor} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Credits:</label>
                  <input type="number" name="credits" value={newSubject.credits} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Document Link (Google Drive):</label>
                  <input type="url" name="documentLink" value={newSubject.documentLink} onChange={handleInputChange} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button" disabled={loading}>
                    <i className="fas fa-save"></i> Save Subject
                  </button>
                  <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>
                    <i className="fas fa-ban"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditForm && (
          <div className="form-overlay">
            <div className="subject-form">
              <div className="form-header">
                <h2>Edit Subject</h2>
                <button className="close-form" onClick={() => { setShowEditForm(false); setEditSubjectId(null); }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleEditSubject}>
                <div className="form-group">
                  <label>Subject Name:</label>
                  <input type="text" name="name" value={newSubject.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Subject Code:</label>
                  <input type="text" name="code" value={newSubject.code} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea name="description" value={newSubject.description} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Instructor:</label>
                  <input type="text" name="instructor" value={newSubject.instructor} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Credits:</label>
                  <input type="number" name="credits" value={newSubject.credits} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Document Link (Google Drive):</label>
                  <input type="url" name="documentLink" value={newSubject.documentLink} onChange={handleInputChange} required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button" disabled={loading}>
                    <i className="fas fa-save"></i> Update Subject
                  </button>
                  <button type="button" className="cancel-button" onClick={() => { setShowEditForm(false); setEditSubjectId(null); }}>
                    <i className="fas fa-ban"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="subject-cards-container">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => (
              <div className="subject-card" key={subject._id}>
                <div className="subject-card-header">
                  <h3>{subject.name}</h3>
                  <span className="subject-code">{subject.code}</span>
                </div>
                <div className="subject-card-body">
                  <p className="subject-description">{subject.description}</p>
                  <div className="subject-details">
                    <p><strong>Instructor:</strong> {subject.instructor}</p>
                    <p><strong>Credits:</strong> {subject.credits}</p>
                  </div>
                </div>
                <div className="subject-card-footer">
                  <button className="document-button" onClick={() => handleOpenDocument(subject.documentLink)}>
                    <i className="fas fa-file-alt"></i> Documents
                  </button>
                  {isTeacher && (
                    <div className="teacher-actions">
                      <button className="edit-button" onClick={() => startEditSubject(subject)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteSubject(subject._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-subjects">
              <i className="fas fa-search"></i>
              <p>No subjects found matching your search criteria.</p>
            </div>
          )}
        </div>

        <footer>
          <p>© {new Date().getFullYear()} College Buddy | MIT ADT University | All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
};

export default YearSubjects;