import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import StudentView from './StudentView';
import TeacherView from './TeacherView';

function TeacherAvailability() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Teachers');
    const { currentUser, isAuthenticated, isTeacher, isStudent } = useAuth();
    const navigate = useNavigate();

    // If not authenticated, redirect to login
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

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

    // Handle tab click
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleLogout = () => {
        // Clear any authentication tokens or user data from localStorage
        localStorage.removeItem('authToken'); // Adjust based on how you store auth data
        
        // Navigate to home or login page
        navigate('/home'); // or navigate('/login') depending on your app flow
        };

    // If authenticated but loading, show loading state
    if (!currentUser) {
        return (
            <div>
                <div className="bg"></div>
                <div className="bg bg2"></div>
                <div className="bg bg3"></div>
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (

        <div className="content-container">
            {isTeacher && <TeacherView />}
            {isStudent && <StudentView />}
                
        </div>
            
    );
}

export default TeacherAvailability;