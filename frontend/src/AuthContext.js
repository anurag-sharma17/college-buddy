import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewLogin, setIsNewLogin] = useState(false);

  // Base API URL from environment variable or default to localhost
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

  // Configure axios to include credentials (cookies) in requests
  axios.defaults.withCredentials = true;

  // Helper function to set user and determine if it's a new login
  const setUser = (userData) => {
    setCurrentUser(userData);
    setIsNewLogin(
      !userData.lastLogin ||
        new Date(userData.lastLogin) > new Date(Date.now() - 5 * 60 * 1000)
    );
  };

  // On mount, fetch current user
  useEffect(() => {
    axios
      .get(`${API_URL}/me`)
      .then((response) => {
        setUser(response.data); // Set user and isNewLogin
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        setLoading(false);
      });
  }, []);

  // Login function
  const login = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/login`, user);
      // Store token in localStorage for API calls
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      setUser(response.data.user); // Set user and isNewLogin
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.error || "Login failed";
    }
  };

  // Register function
  const register = async (user) => {
    try {
      const response = await axios.post(`${API_URL}/register`, user);
      setUser(response.data.user); // Set user and isNewLogin
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data?.error || "Registration failed";
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error.response?.data?.error || "Failed to send reset email";
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`); // Optional: Add a logout endpoint in backend
      localStorage.removeItem("token"); // Clear token
      setCurrentUser(null);
      setIsNewLogin(false);
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token"); // Clear token even on error
      setCurrentUser(null);
      setIsNewLogin(false);
    }
  };

  // Reset isNewLogin flag (used after showing welcome popup)
  const resetNewLoginFlag = () => {
    setIsNewLogin(false);
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    register,
    forgotPassword,
    isAuthenticated: !!currentUser,
    isTeacher: currentUser?.type === "teacher",
    isStudent: currentUser?.type === "student",
    isNewLogin,
    resetNewLoginFlag,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
