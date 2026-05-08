import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import StudentView from './StudentView';
import TeacherView from './TeacherView';

function TeacherAvailability() {
    // eslint-disable-next-line no-unused-vars
    const [isDarkMode, setIsDarkMode] = useState(false);
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