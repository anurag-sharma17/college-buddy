import { useEffect, useState } from 'react';

function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Initialize theme on component mount
    useEffect(() => {
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        const htmlElement = document.documentElement;

        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Check if user prefers dark mode
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                htmlElement.setAttribute('data-theme', 'dark');
                setIsDarkMode(true);
            }
        }
    }, []);

    // Handle theme toggle
    const handleToggle = () => {
        const htmlElement = document.documentElement;
        const newTheme = isDarkMode ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="theme-toggle-wrapper">
            <input
                type="checkbox"
                id="theme-toggle"
                checked={isDarkMode}
                onChange={handleToggle}
            />
            <label htmlFor="theme-toggle" className="theme-toggle-label">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </label>
        </div>
    );
}

export default ThemeToggle;