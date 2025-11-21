import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './css/AlumniConnect.css';

function AlumniConnect() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [alumni, setAlumni] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
    const [showAlumniDetailPopup, setShowAlumniDetailPopup] = useState(false);
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        graduationYear: '',
        department: ''
    });
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Form states for registration
    const [formData, setFormData] = useState({
        personalInfo: {
            name: currentUser ? currentUser.name : '',
            email: currentUser ? currentUser.email : '',
            phone: '',
            graduationYear: '',
            degree: '',
            department: '',
            rollNumber: '',
            profilePhoto: ''
        },
        professionalInfo: {
            company: '',
            position: '',
            experience: '',
            location: ''
        },
        profileContent: {
            bio: '',
            achievements: ''
        },
        socialLinks: {
            linkedin: '',
            twitter: '',
            github: '',
            portfolio: ''
        }
    });

    // Sample alumni data (replace with actual API calls in production)
    useEffect(() => {
        // In a real app, fetch alumni from an API or localStorage
        // Using sample data here
        const sampleAlumni = [
            {
                id: 1,
                personalInfo: {
                    name: "Priya Sharma",
                    email: "priya.sharma@example.com",
                    phone: "+91 9876543210",
                    graduationYear: "2020",
                    degree: "B.Tech",
                    department: "Computer Engineering",
                    rollNumber: "CE2020001",
                    profilePhoto: ""
                },
                professionalInfo: {
                    company: "Microsoft",
                    position: "Software Engineer",
                    experience: "3 years",
                    location: "Pune, India"
                },
                profileContent: {
                    bio: "Software engineer with expertise in cloud computing and AI applications.",
                    achievements: "Microsoft Certified Azure Developer, Best Graduate Award 2020"
                },
                socialLinks: {
                    linkedin: "https://linkedin.com/in/priyasharma",
                    twitter: "https://twitter.com/priya_tech",
                    github: "https://github.com/priyasharma",
                    portfolio: "https://priyasharma.dev"
                }
            },
            {
                id: 2,
                personalInfo: {
                    name: "Rahul Sharma",
                    email: "rahul.desai@example.com",
                    phone: "+91 8765432109",
                    graduationYear: "2019",
                    degree: "B.E.",
                    department: "Electronics Engineering",
                    rollNumber: "EE2019005",
                    profilePhoto: ""
                },
                professionalInfo: {
                    company: "Tesla",
                    position: "Hardware Engineer",
                    experience: "4 years",
                    location: "San Francisco, USA"
                },
                profileContent: {
                    bio: "Working on next-generation electric vehicle systems and sustainable energy solutions.",
                    achievements: "2 patents in battery management systems"
                },
                socialLinks: {
                    linkedin: "https://linkedin.com/in/rahuldesai",
                    twitter: "",
                    github: "https://github.com/rahuldesai",
                    portfolio: "https://rahuldesai.tech"
                }
            },
            {
                id: 3,
                personalInfo: {
                    name: "Anjali Patel",
                    email: "anjali.patel@example.com",
                    phone: "+91 7654321098",
                    graduationYear: "2021",
                    degree: "MBA",
                    department: "Business Administration",
                    rollNumber: "MBA2021003",
                    profilePhoto: ""
                },
                professionalInfo: {
                    company: "Goldman Sachs",
                    position: "Investment Analyst",
                    experience: "2 years",
                    location: "Mumbai, India"
                },
                profileContent: {
                    bio: "Finance professional specializing in equity research and investment analysis.",
                    achievements: "CFA Level 2 Candidate, University Gold Medalist"
                },
                socialLinks: {
                    linkedin: "https://linkedin.com/in/anjalipatel",
                    twitter: "https://twitter.com/anjali_finance",
                    github: "",
                    portfolio: ""
                }
            }
        ];

        setAlumni(sampleAlumni);
        setFilteredAlumni(sampleAlumni);
    }, []);

    // Filter alumni based on search and filters
    useEffect(() => {
        let results = [...alumni];

        // Apply search term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(alum =>
                alum.personalInfo.name.toLowerCase().includes(lowerCaseSearch) ||
                alum.professionalInfo.company.toLowerCase().includes(lowerCaseSearch) ||
                alum.professionalInfo.position.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Apply filters
        if (filters.graduationYear) {
            results = results.filter(alum =>
                alum.personalInfo.graduationYear === filters.graduationYear
            );
        }

        if (filters.department) {
            results = results.filter(alum =>
                alum.personalInfo.department === filters.department
            );
        }

        setFilteredAlumni(results);
    }, [searchTerm, filters, alumni]);

    // Handle form input changes
    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Handle filter changes
    const handleFilterChange = (filter, value) => {
        setFilters(prev => ({
            ...prev,
            [filter]: value
        }));
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle registration button click
    const handleRegisterClick = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setFormData({
            ...formData,
            personalInfo: {
                ...formData.personalInfo,
                name: currentUser.name || '',
                email: currentUser.email || ''
            }
        });

        setShowRegistrationPopup(true);
    };

    // Handle next step in registration
    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    // Handle previous step in registration
    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Validate form data for current step
    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1: // Personal Info
                return formData.personalInfo.name &&
                    formData.personalInfo.email &&
                    formData.personalInfo.graduationYear &&
                    formData.personalInfo.degree &&
                    formData.personalInfo.department;
            case 2: // Professional Info
                return formData.professionalInfo.company &&
                    formData.professionalInfo.position;
            case 3: // Profile Content
                return formData.profileContent.bio;
            case 4: // Social Links
                return true; // Social links are optional
            default:
                return false;
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (isEditing) {
            // Update existing alumni profile
            setAlumni(prev => prev.map(alum => 
                alum.id === editingId ? { ...formData, id: editingId } : alum
            ));
            
            // Reset editing state
            setIsEditing(false);
            setEditingId(null);
        } else {
            // Generate a unique ID for the new alumni
            const newAlumni = {
                id: alumni.length + 1,
                ...formData
            };
    
            // Add the new alumni to the list
            setAlumni(prev => [...prev, newAlumni]);
        }
    
        // Reset form and close popup
        setShowRegistrationPopup(false);
        setCurrentStep(1);
    
        alert(isEditing ? 'Profile updated successfully!' : 'Registration successful! Your alumni profile has been created.');
    };

    // Handle view alumni detail
    const handleViewAlumni = (alum) => {
        setSelectedAlumni(alum);
        setShowAlumniDetailPopup(true);
    };
    
    
// Update the isCurrentUserAlumni function to check by roll number instead of email
const isCurrentUserAlumni = (alum) => {
    return currentUser && 
           currentUser.rollNumber && 
           alum.personalInfo.rollNumber && 
           currentUser.rollNumber === alum.personalInfo.rollNumber;
};

// The rest of the functions remain the same
const handleDeleteProfile = (id) => {
    if (window.confirm('Are you sure you want to delete your alumni profile? This action cannot be undone.')) {
        setAlumni(prev => prev.filter(alum => alum.id !== id));
        setShowAlumniDetailPopup(false);
        alert('Your alumni profile has been deleted successfully.');
    }
};

// Handle update alumni profile
const handleUpdateProfile = (alum) => {
    setFormData({
        personalInfo: { ...alum.personalInfo },
        professionalInfo: { ...alum.professionalInfo },
        profileContent: { ...alum.profileContent },
        socialLinks: { ...alum.socialLinks }
    });
    
    setIsEditing(true);
    setEditingId(alum.id);
    setShowAlumniDetailPopup(false);
    setShowRegistrationPopup(true);
};

    // Reset form on popup close
    const handleClosePopup = () => {
        setShowRegistrationPopup(false);
        setShowAlumniDetailPopup(false);
        setCurrentStep(1);
    };

    // Get unique values for filter dropdowns
    const getUniqueValues = (key, nestedKey) => {
        const values = alumni.map(alum => {
            if (nestedKey) {
                return alum[key][nestedKey];
            }
            return alum[key];
        });
        return [...new Set(values)];
    };

    const uniqueGraduationYears = getUniqueValues('personalInfo', 'graduationYear');
    const uniqueDepartments = getUniqueValues('personalInfo', 'department');

    // Initialize theme on component mount
    useEffect(() => {
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Check if user prefers dark mode
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
                setIsDarkMode(true);
            }
        }
    }, []);

    // Handle theme toggle
    const handleThemeToggle = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

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
                    <div className="logo">Alumni Connect</div>
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
                        {/* Show current user info here if needed */}
                        {currentUser && (
                            <div className="user-info">
                                <i className="fas fa-user"></i>
                                <span>{currentUser.name}</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="alumni-controls">
                    <div className="search-filter-container">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search by name, company, or position..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="filter-options">
                            <div className="filter-item">
                                <label>Graduation Year</label>
                                <select
                                    value={filters.graduationYear}
                                    onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                                >
                                    <option value="">All Years</option>
                                    {uniqueGraduationYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-item">
                                <label>Department</label>
                                <select
                                    value={filters.department}
                                    onChange={(e) => handleFilterChange('department', e.target.value)}
                                >
                                    <option value="">All Departments</option>
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="register-button-container">
                    <button className="register-alumni-btn" onClick={handleRegisterClick}>
                        <i className="fas fa-user-plus"></i> Register as Alumni
                    </button>
                </div>

                {filteredAlumni.length > 0 ? (
                    <div className="alumni-grid">
                        {filteredAlumni.map(alum => (
                            <div key={alum.id} className="alumni-card" onClick={() => handleViewAlumni(alum)}>
                                <div className="alumni-card-header">
                                    <div className="alumni-photo">
                                        {alum.personalInfo.profilePhoto ? (
                                            <img src={alum.personalInfo.profilePhoto} alt={alum.personalInfo.name} />
                                        ) : (
                                            <i className="fas fa-user-graduate"></i>
                                        )}
                                    </div>
                                    <div className="alumni-basic-info">
                                        <h3>{alum.personalInfo.name}</h3>
                                        <p className="alumni-position">{alum.professionalInfo.position}</p>
                                        <p className="alumni-company">{alum.professionalInfo.company}</p>
                                    </div>
                                </div>
                                <div className="alumni-card-body">
                                    <div className="alumni-details">
                                        <p><i className="fas fa-id-badge"></i> ID: {alum.id}</p>
                                        <p><i className="fas fa-graduation-cap"></i> {alum.personalInfo.degree}, {alum.personalInfo.department} ({alum.personalInfo.graduationYear})</p>
                                        <p><i className="fas fa-map-marker-alt"></i> {alum.professionalInfo.location}</p>
                                    </div>
                                </div>
                                <div className="alumni-card-footer">
                                    <button className="view-profile-btn">
                                        View Full Profile <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <i className="fas fa-search"></i>
                        <h3>No alumni found matching your criteria.</h3>
                        <p>Try adjusting your search terms or filters.</p>
                    </div>
                )}

                {/* Alumni Registration Popup */}
                {showRegistrationPopup && (
                    <div className="popup-overlay" onClick={handleClosePopup}>
                        <div className="registration-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header color2">
                                <h3>Alumni Registration</h3>
                                <button className="close-btn" onClick={handleClosePopup}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="popup-content">
                                {/* Step indicator */}
                                <div className="step-indicator">
                                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                        <div className="step-number">1</div>
                                        <div className="step-title">Personal</div>
                                    </div>
                                    <div className="step-line"></div>
                                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                        <div className="step-number">2</div>
                                        <div className="step-title">Professional</div>
                                    </div>
                                    <div className="step-line"></div>
                                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                        <div className="step-number">3</div>
                                        <div className="step-title">Profile</div>
                                    </div>
                                    <div className="step-line"></div>
                                    <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                                        <div className="step-number">4</div>
                                        <div className="step-title">Social</div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* Step 1: Personal Information */}
                                    {currentStep === 1 && (
                                        <div className="form-step">
                                            <h4>Personal Information</h4>

                                            <div className="form-group">
                                                <label>Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo.name}
                                                    onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input
                                                    type="email"
                                                    value={formData.personalInfo.email}
                                                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={formData.personalInfo.phone}
                                                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group half">
                                                    <label>Graduation Year</label>
                                                    <input
                                                        type="text"
                                                        value={formData.personalInfo.graduationYear}
                                                        onChange={(e) => handleInputChange('personalInfo', 'graduationYear', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group half">
                                                    <label>Degree</label>
                                                    <select
                                                        value={formData.personalInfo.degree}
                                                        onChange={(e) => handleInputChange('personalInfo', 'degree', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Degree</option>
                                                        <option value="B.Tech">B.Tech</option>
                                                        <option value="B.E.">B.E.</option>
                                                        <option value="M.Tech">M.Tech</option>
                                                        <option value="MBA">MBA</option>
                                                        <option value="PhD">PhD</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Department</label>
                                                <select
                                                    value={formData.personalInfo.department}
                                                    onChange={(e) => handleInputChange('personalInfo', 'department', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Department</option>
                                                    <option value="Computer Engineering">Computer Engineering</option>
                                                    <option value="Electronics Engineering">Electronics Engineering</option>
                                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                    <option value="Civil Engineering">Civil Engineering</option>
                                                    <option value="Chemical Engineering">Chemical Engineering</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label>Roll Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo.rollNumber}
                                                    onChange={(e) => handleInputChange('personalInfo', 'rollNumber', e.target.value)}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Profile Photo URL</label>
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo.profilePhoto}
                                                    onChange={(e) => handleInputChange('personalInfo', 'profilePhoto', e.target.value)}
                                                    placeholder="Enter URL to your profile photo"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Professional Information */}
                                    {currentStep === 2 && (
                                        <div className="form-step">
                                            <h4>Professional Information</h4>

                                            <div className="form-group">
                                                <label>Current Company</label>
                                                <input
                                                    type="text"
                                                    value={formData.professionalInfo.company}
                                                    onChange={(e) => handleInputChange('professionalInfo', 'company', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Job Position</label>
                                                <input
                                                    type="text"
                                                    value={formData.professionalInfo.position}
                                                    onChange={(e) => handleInputChange('professionalInfo', 'position', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Years of Experience</label>
                                                <input
                                                    type="text"
                                                    value={formData.professionalInfo.experience}
                                                    onChange={(e) => handleInputChange('professionalInfo', 'experience', e.target.value)}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Location</label>
                                                <input
                                                    type="text"
                                                    value={formData.professionalInfo.location}
                                                    onChange={(e) => handleInputChange('professionalInfo', 'location', e.target.value)}
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Profile Content */}
                                    {currentStep === 3 && (
                                        <div className="form-step">
                                            <h4>Profile Content</h4>

                                            <div className="form-group">
                                                <label>Bio</label>
                                                <textarea
                                                    value={formData.profileContent.bio}
                                                    onChange={(e) => handleInputChange('profileContent', 'bio', e.target.value)}
                                                    placeholder="Tell us about yourself..."
                                                    rows="4"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="form-group">
                                                <label>Achievements</label>
                                                <textarea
                                                    value={formData.profileContent.achievements}
                                                    onChange={(e) => handleInputChange('profileContent', 'achievements', e.target.value)}
                                                    placeholder="List your major achievements"
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Social Links */}
                                    {currentStep === 4 && (
                                        <div className="form-step">
                                            <h4>Social Media Links</h4>

                                            <div className="form-group">
                                                <label>LinkedIn</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks.linkedin}
                                                    onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Twitter</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks.twitter}
                                                    onChange={(e) => handleInputChange('socialLinks', 'twitter', e.target.value)}
                                                    placeholder="https://twitter.com/yourusername"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>GitHub</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks.github}
                                                    onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)}
                                                    placeholder="https://github.com/yourusername"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Portfolio Website</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks.portfolio}
                                                    onChange={(e) => handleInputChange('socialLinks', 'portfolio', e.target.value)}
                                                    placeholder="https://yourportfolio.com"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-navigation">
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                className="prev-btn"
                                                onClick={handlePrevious}
                                            >
                                                <i className="fas fa-arrow-left"></i> Previous
                                            </button>
                                        )}

                                        {currentStep < 4 ? (
                                            <button
                                                type="button"
                                                className="next-btn"
                                                onClick={handleNext}
                                                disabled={!validateCurrentStep()}
                                            >
                                                Next <i className="fas fa-arrow-right"></i>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="submit-btn"
                                                disabled={!validateCurrentStep()}
                                            >
                                                Submit <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alumni Detail Popup */}
                {showAlumniDetailPopup && selectedAlumni && (
                    <div className="popup-overlay" onClick={handleClosePopup}>
                        <div className="alumni-detail-popup" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-header">
                                <h3>Alumni Profile</h3>
                                <button className="close-btn" onClick={handleClosePopup}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="popup-content">
                                <div className="alumni-detail-header">
                                    <div className="alumni-detail-photo">
                                        {selectedAlumni.personalInfo.profilePhoto ? (
                                            <img src={selectedAlumni.personalInfo.profilePhoto} alt={selectedAlumni.personalInfo.name} />
                                        ) : (
                                            <i className="fas fa-user-graduate"></i>
                                        )}
                                    </div>
                                    <div className="alumni-detail-intro">
                                        <h2>{selectedAlumni.personalInfo.name}</h2>
                                        <p className="alumni-position">{selectedAlumni.professionalInfo.position} at {selectedAlumni.professionalInfo.company}</p>
                                        <p className="alumni-location"><i className="fas fa-map-marker-alt"></i> {selectedAlumni.professionalInfo.location}</p>
                                    </div>
                                </div>

                                <div className="alumni-detail-section">
                                    <h4><i className="fas fa-user"></i> Personal Information</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">ID:</span>
                                            <span className="detail-value">{selectedAlumni.id}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{selectedAlumni.personalInfo.email}</span>
                                        </div>
                                        {selectedAlumni.personalInfo.phone && (
                                            <div className="detail-item">
                                                <span className="detail-label">Phone:</span>
                                                <span className="detail-value">{selectedAlumni.personalInfo.phone}</span>
                                            </div>
                                        )}
                                        <div className="detail-item">
                                            <span className="detail-label">Degree:</span>
                                            <span className="detail-value">{selectedAlumni.personalInfo.degree}, {selectedAlumni.personalInfo.department}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Graduation Year:</span>
                                            <span className="detail-value">{selectedAlumni.personalInfo.graduationYear}</span>
                                        </div>
                                        {selectedAlumni.personalInfo.rollNumber && (
                                            <div className="detail-item">
                                                <span className="detail-label">Roll Number:</span>
                                                <span className="detail-value">{selectedAlumni.personalInfo.rollNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="alumni-detail-section">
                                    <h4><i className="fas fa-briefcase"></i> Professional Information</h4>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Company:</span>
                                            <span className="detail-value">{selectedAlumni.professionalInfo.company}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Position:</span>
                                            <span className="detail-value">{selectedAlumni.professionalInfo.position}</span>
                                        </div>
                                        {selectedAlumni.professionalInfo.experience && (
                                            <div className="detail-item">
                                                <span className="detail-label">Experience:</span>
                                                <span className="detail-value">{selectedAlumni.professionalInfo.experience}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="alumni-detail-section">
                                    <h4><i className="fas fa-address-card"></i> Bio</h4>
                                    <p className="alumni-bio">{selectedAlumni.profileContent.bio}</p>
                                </div>

                                {selectedAlumni.profileContent.achievements && (
                                    <div className="alumni-detail-section">
                                        <h4><i className="fas fa-trophy"></i> Achievements</h4>
                                        <p>{selectedAlumni.profileContent.achievements}</p>
                                    </div>
                                )}

                                <div className="alumni-detail-section">
                                    <h4><i className="fas fa-link"></i> Social Links</h4>
                                    <div className="social-links">
                                        {selectedAlumni.socialLinks.linkedin && (
                                            <a href={selectedAlumni.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                                <i className="fab fa-linkedin"></i> LinkedIn
                                            </a>
                                        )}
                                        {selectedAlumni.socialLinks.twitter && (
                                            <a href={selectedAlumni.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                                                <i className="fab fa-twitter"></i> Twitter
                                            </a>
                                        )}
                                        {selectedAlumni.socialLinks.github && (
                                            <a href={selectedAlumni.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
                                                <i className="fab fa-github"></i> GitHub
                                            </a>
                                        )}
                                        {selectedAlumni.socialLinks.portfolio && (
                                            <a href={selectedAlumni.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                                                <i className="fas fa-globe"></i> Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {isCurrentUserAlumni(selectedAlumni) && (
                                    <div className="alumni-actions">
                                        <button className="edit-profile-btn" onClick={() => handleUpdateProfile(selectedAlumni)}>
                                            <i className="fas fa-edit"></i> Edit Profile
                                        </button>
                                        <button className="delete-profile-btn" onClick={() => handleDeleteProfile(selectedAlumni.id)}>
                                            <i className="fas fa-trash-alt"></i> Delete Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <footer>
                    <p>&copy; 2025 College Buddy App. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default AlumniConnect;