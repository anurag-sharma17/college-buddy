import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Add this import
import './css/ClubsPage.css';

function ClubsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [clubs, setClubs] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClub, setNewClub] = useState({
        name: '',
        category: 'Technical',
        description: '',
        contactEmail: '',
        leadName: '',
        upcomingEvent: '',
        eventDate: ''
    });
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Use the auth context
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load clubs from localStorage or use initial data if empty
    useEffect(() => {
        // Try to get clubs from localStorage
        const storedClubs = localStorage.getItem('clubs');
        
        if (storedClubs) {
            // Use stored clubs if they exist
            setClubs(JSON.parse(storedClubs));
        } else {
            // Otherwise use sample data
            const clubsData = [
                {
                    id: 1,
                    name: 'AWS Club',
                    logo: '/assets/clubs/aws-club.jpg', // You'll need to add these images
                    category: 'Technical',
                    members: 156,
                    description: 'Learn cloud computing with AWS services. Members get hands-on experience with EC2, S3, Lambda, and more through workshops and certification study groups.',
                    upcomingEvent: 'AWS Solutions Architect Certification Workshop',
                    eventDate: '2025-04-15T14:00:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/aws_club_mit',
                        linkedin: 'https://linkedin.com/in/aws-club-mit',
                        website: 'https://awsclub.mitadt.edu'
                    },
                    contactEmail: 'aws.club@mitadt.edu',
                    leadName: 'Priya Sharma'
                },
                {
                    id: 2,
                    name: 'GFG Club',
                    logo: '/assets/clubs/gfg-club.jpg',
                    category: 'Technical',
                    members: 203,
                    description: 'GeeksforGeeks campus club focused on algorithms, data structures, and competitive programming. Regular coding contests, interview preparation, and problem-solving sessions.',
                    upcomingEvent: 'Code Sprint Challenge',
                    eventDate: '2025-04-18T18:30:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/gfg_mitadt',
                        twitter: 'https://twitter.com/gfg_mitadt',
                        website: 'https://gfg.mitadt.edu'
                    },
                    contactEmail: 'gfg.club@mitadt.edu',
                    leadName: 'Arjun Mehta'
                },
                {
                    id: 3,
                    name: 'JavaBrewers Club',
                    logo: '/assets/clubs/java-club.jpeg',
                    category: 'Technical',
                    members: 124,
                    description: 'For Java enthusiasts and coffee lovers alike! Learn Java programming from basics to advanced frameworks like Spring Boot and Android development.',
                    upcomingEvent: 'Spring Boot Microservices Workshop',
                    eventDate: '2025-04-20T16:00:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/javabrewers',
                        github: 'https://github.com/javabrewers-mit',
                        website: 'https://javabrewers.mitadt.edu'
                    },
                    contactEmail: 'java.brewers@mitadt.edu',
                    leadName: 'Rahul Desai'
                },
                {
                    id: 4,
                    name: 'Cloud Computing Club',
                    logo: '/assets/clubs/cloud-club.png',
                    category: 'Technical',
                    members: 147,
                    description: 'Explore multi-cloud environments including AWS, Azure, and Google Cloud. Workshops on DevOps, containerization, and cloud architecture design patterns.',
                    upcomingEvent: 'Multi-Cloud Deployment Strategies',
                    eventDate: '2025-04-22T15:30:00',
                    socialLinks: {
                        linkedin: 'https://linkedin.com/in/cloud-club-mit',
                        github: 'https://github.com/cloud-club-mit',
                        website: 'https://cloudclub.mitadt.edu'
                    },
                    contactEmail: 'cloud.computing@mitadt.edu',
                    leadName: 'Amit Patel'
                },
                {
                    id: 5,
                    name: 'Robotics Club',
                    logo: '/assets/clubs/robotics-club.jpg',
                    category: 'Technical',
                    members: 89,
                    description: 'Design, build and program robots for competitions and practical applications. Work with Arduino, Raspberry Pi, sensors, and mechanical components.',
                    upcomingEvent: 'Line Following Robot Competition',
                    eventDate: '2025-04-25T12:00:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/robotics_mitadt',
                        youtube: 'https://youtube.com/robotics_mitadt',
                        website: 'https://robotics.mitadt.edu'
                    },
                    contactEmail: 'robotics.club@mitadt.edu',
                    leadName: 'Sneha Kumar'
                },
                {
                    id: 6,
                    name: 'Photography Club',
                    logo: '/assets/clubs/photo-club.jpg',
                    category: 'Arts',
                    members: 112,
                    description: 'For photography enthusiasts of all skill levels. Weekly photo walks, editing workshops, and semester-end exhibitions to showcase student work.',
                    upcomingEvent: 'Campus Night Photography Workshop',
                    eventDate: '2025-04-16T19:00:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/lens_mitadt',
                        flickr: 'https://flickr.com/groups/mitadt_photos',
                        website: 'https://photoclub.mitadt.edu'
                    },
                    contactEmail: 'photo.club@mitadt.edu',
                    leadName: 'Nisha Gupta'
                },
                {
                    id: 7,
                    name: 'Entrepreneurship Club',
                    logo: '/assets/clubs/entrepreneur-club.jpg',
                    category: 'Business',
                    members: 134,
                    description: 'Foster innovation and entrepreneurial spirit among students. Startup ideation sessions, business plan competitions, and networking with industry professionals.',
                    upcomingEvent: 'Startup Pitch Competition',
                    eventDate: '2025-04-28T14:00:00',
                    socialLinks: {
                        linkedin: 'https://linkedin.com/in/eclub-mitadt',
                        twitter: 'https://twitter.com/eclub_mitadt',
                        website: 'https://eclub.mitadt.edu'
                    },
                    contactEmail: 'e.club@mitadt.edu',
                    leadName: 'Rishi Shah'
                },
                {
                    id: 8,
                    name: 'Cultural Club',
                    logo: '/assets/clubs/cultural-club.jpg',
                    category: 'Cultural',
                    members: 178,
                    description: 'Celebrate diversity through cultural events, festivals, and performances. Learn about different traditions, music, dance, and cuisines from around the world.',
                    upcomingEvent: 'International Food Festival',
                    eventDate: '2025-04-30T11:00:00',
                    socialLinks: {
                        instagram: 'https://instagram.com/cultural_mitadt',
                        facebook: 'https://facebook.com/culturalclub_mitadt',
                        website: 'https://culturalclub.mitadt.edu'
                    },
                    contactEmail: 'cultural.club@mitadt.edu',
                    leadName: 'Ayesha Khan'
                }
            ];

            setClubs(clubsData);
            // Store initial data in localStorage
            localStorage.setItem('clubs', JSON.stringify(clubsData));
        }
    }, []);

    // Filter clubs based on search term and category
    const filteredClubs = clubs.filter(club => {
        return club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                club.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Format date for display
    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle club card click to show details
    const handleClubClick = (clubId) => {
        // Use the auth context instead of localStorage
        if (!currentUser) {
            alert('Please login first to view club details');
            navigate('/login', { state: { returnTo: `/clubs/${clubId}` } });
            return;
        }

        // User is logged in, navigate to club details page
        navigate(`/clubs/${clubId}`);
    };
    
    const canModifyClub = (clubId) => {
        if (!currentUser) return false;
        
        // Check if the user's clubId matches the club's id
        return currentUser.clubId === clubId.toString();
    };

    // Check if user can create a new club
    const canCreateClub = () => {
        if (!currentUser) return false;

        // User must be a teacher AND not a club member
        return currentUser.type === 'teacher' && currentUser.isClubMember !== true;
    };

    // Handle club creation form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClub(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle club creation form submission with localStorage update
    const handleCreateClub = (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert('Please login to create a club');
            setShowCreateModal(false);
            navigate('/login', { state: { returnTo: '/clubs' } });
            return;
        }

        // Check if user is a teacher and not already a club member
        if (currentUser.type !== 'teacher') {
            alert('Only teachers can create new clubs');
            setShowCreateModal(false);
            return;
        }

        if (currentUser.isClubMember === true) {
            alert('You are already a member of a club. You cannot create a new club');
            setShowCreateModal(false);
            return;
        }

        // Create new club
        const newClubData = {
            id: clubs.length + 1,
            ...newClub,
            logo: '/assets/default-club-logo.jpg',
            members: [{ id: currentUser.id, name: currentUser.name, role: 'lead' }],
            membersArray: [{ id: currentUser.id, name: currentUser.name, role: 'lead' }], // Add both formats for compatibility
            memberCount: 1,
            socialLinks: {},
            eventDate: newClub.eventDate || new Date().toISOString() // Default to current date if not provided
        };

        // Update state with new club
        const updatedClubs = [...clubs, newClubData];
        setClubs(updatedClubs);
        
        // Store updated clubs in localStorage
        localStorage.setItem('clubs', JSON.stringify(updatedClubs));
        
        setShowCreateModal(false);
        alert('Club created successfully! Your club is now listed.');

        // Reset form
        setNewClub({
            name: '',
            category: 'Technical',
            description: '',
            contactEmail: '',
            leadName: '',
            upcomingEvent: '',
            eventDate: ''
        });
    };

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
                    <div className="logo">College Clubs</div>
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

                <div className="clubs-filter-section">
                    <div className="search-bar">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="clubs-grid">
                    {filteredClubs.length > 0 ? (
                        filteredClubs.map(club => (
                            <div key={club.id} className="club-card" onClick={() => handleClubClick(club.id)}>
                                {/* Club card content remains the same */}
                                <div className="club-header">
                                    <div className="club-logo">
                                        <img
                                            src={club.logo}
                                            alt={`${club.name} Logo`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/default-club-logo.jpg";
                                            }}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="club-title">
                                        <h3>{club.name}</h3>
                                        <span className="club-category">{club.category}</span>
                                    </div>
                                </div>

                                <div className="club-body">
                                    <p className="club-description">{club.description}</p>

                                    <div className="club-stats">
                                        <div className="stat">
                                            <i className="fas fa-users"></i>
                                            <span>{club.memberCount || club.members || 0} members</span>
                                        </div>
                                        <div className="stat">
                                            <i className="fas fa-user-tie"></i>
                                            <span>Lead: {club.leadName}</span>
                                        </div>
                                    <div className="stat club-id">
                                        <i className="fas fa-id-badge"></i>
                                        <span>Club ID: {club.id}</span>
                                    </div>
                                    </div>
                                    <div className="club-event">
                                        <h4>Upcoming Event:</h4>
                                        <p>{club.upcomingEvent}</p>
                                        <p className="event-date">
                                            <i className="far fa-calendar-alt"></i> {formatEventDate(club.eventDate)}
                                        </p>
                                    </div>
                                </div>

                                <div className="club-footer">
                                    <div className="social-links">
                                        {club.socialLinks.instagram && (
                                            <a href={club.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        )}
                                        {club.socialLinks.linkedin && (
                                            <a href={club.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <i className="fab fa-linkedin"></i>
                                            </a>
                                        )}
                                        {club.socialLinks.github && (
                                            <a href={club.socialLinks.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <i className="fab fa-github"></i>
                                            </a>
                                        )}
                                        {club.socialLinks.twitter && (
                                            <a href={club.socialLinks.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        )}
                                        {club.socialLinks.website && (
                                            <a href={club.socialLinks.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <i className="fas fa-globe"></i>
                                            </a>
                                        )}
                                    </div>
                                    {canModifyClub(club.id) && (
                                        <button 
                                            className="btn join-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/clubs/${club.id}`);
                                            }}
                                        >
                                            <i className="fas fa-edit"></i> Modify Info
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-search"></i>
                            <h3>No clubs found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                <div className="create-club-section">
                    <h3>Don't see a club that interests you?</h3>
                    <p>Start your own club and build a community around your passion!</p>
                    <button
                        className={`btn create-club-btn ${!canCreateClub() ? 'disabled' : ''}`}
                        onClick={() => {

                            if (!currentUser) {
                                alert('Please login first to create a club');
                                navigate('/login', { state: { returnTo: '/clubs' } });
                                return;
                            }

                            if (canCreateClub()) {
                                setShowCreateModal(true);
                            } else {
                                if (currentUser.type !== 'teacher') {
                                    alert('Only teachers can create new clubs');
                                } else {
                                    alert('You are already a member of a club and cannot create a new one');
                                }
                            }
                        }}
                    >
                        <i className="fas fa-plus"></i> Create New Club
                    </button>
                </div>

                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Create New Club</h3>
                                <button className="close-modal" onClick={() => setShowCreateModal(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <form onSubmit={handleCreateClub}>
                                <div className="form-group">
                                    <label htmlFor="club-name">Club Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="club-name"
                                        name="name"
                                        value={newClub.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="club-category">Category <span className="required">*</span></label>
                                    <select
                                        id="club-category"
                                        name="category"
                                        value={newClub.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Technical">Technical</option>
                                        <option value="Arts">Arts</option>
                                        <option value="Business">Business</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="club-description">Description <span className="required">*</span></label>
                                    <textarea
                                        id="club-description"
                                        name="description"
                                        value={newClub.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-email">Contact Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="contactEmail"
                                        value={newClub.contactEmail}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lead-name">Club Lead Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="lead-name"
                                        name="leadName"
                                        value={newClub.leadName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="upcoming-event">Upcoming Event (Optional)</label>
                                    <input
                                        type="text"
                                        id="upcoming-event"
                                        name="upcomingEvent"
                                        value={newClub.upcomingEvent}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="event-date">Event Date (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        id="event-date"
                                        name="eventDate"
                                        value={newClub.eventDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn cancel-btn" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn submit-btn">
                                        Create Club
                                    </button>
                                </div>
                            </form>
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

export default ClubsPage;