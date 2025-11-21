import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './css/Specializations.css';

const Specializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('third');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSpecializationId, setEditSpecializationId] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    credits: '',
    description: '',
    documentLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const isTeacher = currentUser && currentUser.type === 'teacher';

  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/specializations/${selectedYear}`, {
          withCredentials: true
        });
        setSpecializations(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch specializations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, [selectedYear]);

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

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleOpenDocument = (link) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('No document link available for this subject.');
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
        year: 'specialization',
        specializationId: editSpecializationId
      }, { withCredentials: true });
      setSpecializations(specializations.map(spec =>
        spec._id === editSpecializationId
          ? { ...spec, subjects: [...spec.subjects, response.data] }
          : spec
      ));
      setShowAddForm(false);
      setNewSubject({ name: '', credits: '', description: '', documentLink: '' });
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
        year: 'specialization',
        specializationId: editSpecializationId
      }, { withCredentials: true });
      setSpecializations(specializations.map(spec =>
        spec._id === editSpecializationId
          ? {
              ...spec,
              subjects: spec.subjects.map(sub => sub._id === editSubjectId ? response.data : sub)
            }
          : spec
      ));
      setShowEditForm(false);
      setEditSubjectId(null);
      setNewSubject({ name: '', credits: '', description: '', documentLink: '' });
      setError(null);
    } catch (err) {
      setError('Failed to update subject');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditSubject = (specializationId, subject) => {
    setEditSpecializationId(specializationId);
    setEditSubjectId(subject._id);
    setNewSubject({
      name: subject.name,
      credits: subject.credits.toString(),
      description: subject.description,
      documentLink: subject.documentLink || ''
    });
    setShowEditForm(true);
  };

  const handleDeleteSubject = async (specializationId, subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/subjects/${subjectId}`, { withCredentials: true });
        setSpecializations(specializations.map(spec =>
          spec._id === specializationId
            ? { ...spec, subjects: spec.subjects.filter(sub => sub._id !== subjectId) }
            : spec
        ));
        setError(null);
      } catch (err) {
        setError('Failed to delete subject');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const startAddSubject = (specializationId) => {
    setEditSpecializationId(specializationId);
    setShowAddForm(true);
  };

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.subjects.some(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const yearText = selectedYear === 'third' ? 'Third' : 'Fourth';

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
          <div className="logo">Specialization Tracks</div>
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
              placeholder="Search specializations or subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="year-tabs">
          <button
            className={`year-tab ${selectedYear === 'third' ? 'active' : ''}`}
            onClick={() => setSelectedYear('third')}
          >
            Third Year
          </button>
          <button
            className={`year-tab ${selectedYear === 'fourth' ? 'active' : ''}`}
            onClick={() => setSelectedYear('fourth')}
          >
            Fourth Year
          </button>
        </div>

        <h2 className="year-title">{yearText} Year Specializations</h2>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}

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
                  <label>Credits:</label>
                  <input type="number" name="credits" value={newSubject.credits} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea name="description" value={newSubject.description} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Document Link (Google Drive):</label>
                  <input type="url" name="documentLink" value={newSubject.documentLink} onChange={handleInputChange} />
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
                  <label>Credits:</label>
                  <input type="number" name="credits" value={newSubject.credits} onChange={handleInputChange} required min="1" />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea name="description" value={newSubject.description} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Document Link (Google Drive):</label>
                  <input type="url" name="documentLink" value={newSubject.documentLink} onChange={handleInputChange} />
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

        <div className="specializations-container">
          {filteredSpecializations.length > 0 ? (
            filteredSpecializations.map(specialization => (
              <div className="specialization-section" key={specialization._id}>
                <div className={`specialization-header ${specialization.color}`}>
                  <div className="specialization-icon">
                    <i className={specialization.icon}></i>
                  </div>
                  <div className="specialization-info">
                    <h3>{specialization.name}</h3>
                    <span className="specialization-code">{specialization.code}</span>
                  </div>
                </div>
                <div className="specialization-description">
                  <p>{specialization.description}</p>
                </div>
                {isTeacher && (
                  <div className="add-subject-button-container">
                    <button className="add-subject-button" onClick={() => startAddSubject(specialization._id)}>
                      <i className="fas fa-plus"></i> Add New Subject
                    </button>
                  </div>
                )}
                <div className="subject-cards-container">
                  {specialization.subjects.map(subject => (
                    <div className="subject-card" key={subject._id}>
                      <div className="subject-card-header">
                        <h3>{subject.name}</h3>
                        <span className="subject-credits">{subject.credits} Credits</span>
                      </div>
                      <div className="subject-card-body">
                        <p className="subject-description">{subject.description}</p>
                      </div>
                      <div className="subject-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className="document-button" onClick={() => handleOpenDocument(subject.documentLink)}>
                          <i className="fas fa-file-alt"></i> Documents
                        </button>
                        {isTeacher && (
                          <div className="teacher-actions" style={{ display: 'flex', gap: '8px' }}>
                            <button className="edit-button" onClick={() => startEditSubject(specialization._id, subject)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteSubject(specialization._id, subject._id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-specializations">
              <i className="fas fa-search"></i>
              <p>No {yearText.toLowerCase()} year specializations found matching your search criteria.</p>
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

export default Specializations;