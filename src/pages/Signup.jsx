import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import TeacherService from '../TeacherService';
import './Login.css';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
    enrollmentNumber: '', // Changed from rollNumber to enrollmentNumber for students
    employeeId: '', // Added for teachers
    isClubMember: false,
    clubId: '',
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // For checkbox inputs, use the checked property
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Special case for club membership checkbox
    if (name === 'isClubMember' && !checked) {
      setFormData({
        ...formData,
        isClubMember: false,
        clubId: '' // Reset clubId when unchecked
      });
    } else {
      setFormData({
        ...formData,
        [name]: inputValue
      });
    }
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Improved email validation
  const validateEmail = (email) => {
    // Robust email regex that checks for:
    // - Valid local part with allowed characters (letters, numbers, and common special chars)
    // - Valid domain with proper domain name format
    // - Valid TLD between 2-6 characters
    // - No consecutive special characters or misplaced special characters
    // - No special characters at the beginning or end of local part
    const emailRegex = /^(?=[a-zA-Z0-9._-])[a-zA-Z0-9._-]+(?<![.-])@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // Additional validation checks
    if (email.includes('..') || email.includes('.-') || email.includes('-.')) {
      return false; // No consecutive dots or dots with hyphens
    }
    
    if (email.split('@')[1].startsWith('.') || email.split('@')[1].startsWith('-')) {
      return false; // Domain can't start with dot or hyphen
    }
    
    if (email.split('.').pop().length < 2 || email.split('.').pop().length > 6) {
      return false; // TLD must be between 2-6 characters
    }
    
    return emailRegex.test(email);
  };

  // Validate enrollment number format (capital letters and numbers)
  const validateEnrollmentNumber = (enrollmentNum) => {
    // This regex requires at least one uppercase letter and at least one number
    const enrollmentRegex = /^[A-Z0-9]+$/;
    return enrollmentRegex.test(enrollmentNum);
  };

  // Validate employee ID format (numbers only)
  const validateEmployeeId = (employeeId) => {
    const employeeIdRegex = /^[0-9]+$/;
    return employeeIdRegex.test(employeeId);
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return false;
    }
    
    // Check validation based on role
    if (formData.role === 'student') {
      if (!formData.enrollmentNumber.trim()) {
        setError('Please enter your enrollment number');
        return false;
      }
      if (!validateEnrollmentNumber(formData.enrollmentNumber)) {
        setError('Enrollment number must contain only capital letters and numbers');
        return false;
      }
    } else if (formData.role === 'teacher') {
      if (!formData.employeeId.trim()) {
        setError('Please enter your employee ID');
        return false;
      }
      if (!validateEmployeeId(formData.employeeId)) {
        setError('Employee ID must contain only numbers');
        return false;
      }
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    // Check for password strength (at least one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // If user is a club member, club ID is required
    if (formData.isClubMember && !formData.clubId.trim()) {
      setError('Please enter your club ID');
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setError('');
      setStep(2);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    try {
      // Create new user object
      const newUser = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        type: formData.role,
        enrollmentNumber: formData.role === 'student' ? formData.enrollmentNumber : '',
        employeeId: formData.role === 'teacher' ? formData.employeeId : '',
        clubId: formData.isClubMember ? formData.clubId : '',
        createdAt: new Date().toISOString()
      };

      // Use Auth context if available, otherwise fall back to localStorage
      if (register) {
        const success = await register(newUser);
        
        if (success) {
          // If the user is a teacher, add them to the teachers list as well
          if (formData.role === 'teacher') {
            await TeacherService.addTeacher({
              name: formData.fullName,
              email: formData.email,
              cabinNo: '',
              phone: '',
              available: true,
              timetable: [],
              employeeId: formData.employeeId,
              clubId: formData.isClubMember ? formData.clubId : ''
            });
          }
          
          navigate('/home');
        } else {
          setError('Email already in use. Please try another email.');
        }
      } else {
        // Fallback to localStorage implementation
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email is already in use
        if (users.some(user => user.email === formData.email)) {
          setError('This email is already registered');
          return;
        }
        
        const newUserLocal = {
          id: Date.now().toString(),
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          enrollmentNumber: formData.role === 'student' ? formData.enrollmentNumber : '',
          employeeId: formData.role === 'teacher' ? formData.employeeId : '',
          clubId: formData.isClubMember ? formData.clubId : '',
          createdAt: new Date().toISOString()
        };
        
        users.push(newUserLocal);
        localStorage.setItem('users', JSON.stringify(users));

        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! You can now log in.', 
            type: 'success' 
          } 
        });
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="signup-page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      
      <div className="logo-container">
        <center><img src="/assets/MITADT.png" alt="MITADT" /></center>
      </div>
      
      <div className="container">
        <header>
          <div className="logo">College Buddy</div>
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

        <div className="welcome-banner">
          <h2>Join College Buddy</h2>
          <p>Create an account to access all features</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <i className="fas fa-user-plus"></i>
            <h3>Create Account</h3>
          </div>
          <div className="auth-card-body">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
            
            <div className="progress-indicator">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Account</div>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Security</div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="step-content fade-in">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your full name"
                      aria-required="true"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="name@example.com"
                      aria-required="true"
                    />
                    <small className="form-text">Please enter a valid email format (e.g., name@example.com). We'll never share your email with anyone else.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">I am a: <span className="required">*</span></label>
                    <div className="role-selection">
                      <label className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="role"
                          value="student"
                          checked={formData.role === 'student'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-user-graduate"></i>
                        <span>Student</span>
                      </label>
                      <label className={`role-option ${formData.role === 'teacher' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="role"
                          value="teacher"
                          checked={formData.role === 'teacher'}
                          onChange={handleChange}
                        />
                        <i className="fas fa-chalkboard-teacher"></i>
                        <span>Teacher</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Enrollment Number Field - Only shows for students */}
                  {formData.role === 'student' && (
                    <div className="form-group">
                      <label htmlFor="enrollmentNumber">Enrollment Number <span className="required">*</span></label>
                      <input
                        type="text"
                        id="enrollmentNumber"
                        name="enrollmentNumber"
                        value={formData.enrollmentNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. CE2020001"
                        aria-required="true"
                      />
                      <small className="form-text">Enrollment number must contain only capital letters and numbers.</small>
                    </div>
                  )}
                  
                  {/* Employee ID Field - Only shows for teachers */}
                  {formData.role === 'teacher' && (
                    <div className="form-group">
                      <label htmlFor="employeeId">Employee ID <span className="required">*</span></label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 12345"
                        aria-required="true"
                      />
                      <small className="form-text">Employee ID must contain only numbers.</small>
                    </div>
                  )}
                  
                  <button type="button" className="btn primary-btn" onClick={nextStep}>
                    Continue <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <div className="step-content fade-in">
                  <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Create a password"
                        aria-required="true"
                      />
                      <button 
                        type="button" 
                        className="password-toggle" 
                        onClick={togglePasswordVisibility}
                        tabIndex="-1"
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <small className="form-text">Password must be at least 8 characters with uppercase, lowercase, and numbers.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Confirm your password"
                        aria-required="true"
                      />
                      <button 
                        type="button" 
                        className="password-toggle" 
                        onClick={toggleConfirmPasswordVisibility}
                        tabIndex="-1"
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Club Member Checkbox - Fixed styling to show tick mark */}
                  <div className="form-group">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        id="isClubMember"
                        name="isClubMember"
                        checked={formData.isClubMember}
                        onChange={handleChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-label">I am a club member</span>
                    </label>
                  </div>
                  
                  {/* Conditional Club ID Field */}
                  {formData.isClubMember && (
                    <div className="form-group club-id-container">
                      <label htmlFor="clubId">Club ID <span className="required">*</span></label>
                      <input
                        type="text"
                        id="clubId"
                        name="clubId"
                        value={formData.clubId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your club ID"
                        aria-required="true"
                      />
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button type="button" className="btn secondary-btn" onClick={prevStep}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="submit" className="btn primary-btn">
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </form>
            
            <div className="auth-footer">
              Already have an account? <Link to="/login" className="text-link">Login</Link>
            </div>
          </div>
        </div>

        <footer>
          <p>&copy; 2025 College Buddy App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Signup;