import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { login, forgotPassword } = useAuth();

  useEffect(() => {
    // Theme setup
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

    // Pre-fill email if remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const { email } = JSON.parse(rememberedUser);
      setEmail(email);
      setRememberMe(true);
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      navigate('/home');
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!emailRegex.test(resetEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(resetEmail);
      setResetEmailSent(true);
      setError('');
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="logo-container">
        <center>
          <img src="/assets/MITADT.png" alt="MITADT" />
        </center>
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
          <h2>Welcome Back to College Buddy</h2>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <i className="fas fa-sign-in-alt"></i>
            <h3>{showResetForm ? 'Reset Password' : 'Login'}</h3>
          </div>
          <div className="auth-card-body">
            {error && <div className="error-message">{error}</div>}

            {showResetForm ? (
              resetEmailSent ? (
                <div className="success-message">
                  <p>Password reset instructions have been sent to {resetEmail}.</p>
                  <button
                    className="btn secondary-btn"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetEmailSent(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label htmlFor="resetEmail">Email Address</label>
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn primary-btn" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <button
                      type="button"
                      className="btn secondary-btn"
                      onClick={() => setShowResetForm(false)}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <div className="forgot-password">
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-link"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn primary-btn" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className="auth-footer">
                  Don't have an account? <Link to="/signup" className="text-link">Sign up</Link>
                </div>
              </form>
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

export default Login;