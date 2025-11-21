import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/ClubDetailPage.css'; // Make sure to create this file for styling

function ClubDetailPage() {
    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [editMode, setEditMode] = useState(false);
    const [editedClub, setEditedClub] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulating API fetch for club details
        // In a real application, you would fetch from your backend
        setTimeout(() => {
            // This would be your API call
            const clubsData = [
                {
                    id: 1,
                    name: 'AWS Club',
                    logo: '/assets/clubs/aws-club.jpg',
                    coverImage: '/assets/clubs/aws-cover.jpg',
                    category: 'Technical',
                    members: 156,
                    description: 'Learn cloud computing with AWS services. Members get hands-on experience with EC2, S3, Lambda, and more through workshops and certification study groups.',
                    longDescription: 'The AWS Club at MIT ADT is dedicated to helping students learn about cloud computing using Amazon Web Services. Our club provides hands-on workshops, certification preparation, and networking opportunities with industry professionals. Members gain practical experience with various AWS services including EC2, S3, Lambda, DynamoDB, and more. We organize regular study groups for AWS certification exams, hackathons focused on cloud solutions, and guest lectures from AWS professionals.',
                    foundedYear: 2021,
                    meetingSchedule: 'Every Tuesday, 5:00 PM - 7:00 PM',
                    meetingLocation: 'Tech Building, Room 302',
                    upcomingEvent: 'AWS Solutions Architect Certification Workshop',
                    eventDate: '2025-04-15T14:00:00',
                    pastEvents: [
                        { name: 'AWS GameDay Challenge', date: '2025-03-10' },
                        { name: 'Cloud Resume Challenge Workshop', date: '2025-02-22' },
                        { name: 'Serverless Architecture Demo Day', date: '2025-01-18' }
                    ],
                    achievements: [
                        '2024 Inter-College Cloud Computing Challenge Winners',
                        'Organized Cloud Career Fair with 15+ companies',
                        '25+ members achieved AWS certifications in 2024'
                    ],
                    resources: [
                        { name: 'AWS Free Tier Guide', url: '#' },
                        { name: 'Club Workshop Materials', url: '#' },
                        { name: 'AWS Certification Roadmap', url: '#' }
                    ],
                    socialLinks: {
                        instagram: 'https://instagram.com/aws_club_mit',
                        linkedin: 'https://linkedin.com/in/aws-club-mit',
                        website: 'https://awsclub.mitadt.edu'
                    },
                    contactEmail: 'aws.club@mitadt.edu',
                    leadName: 'Priya Sharma',
                    leadProfilePic: '/assets/members/priya.jpg',
                    leadBio: 'Senior in Computer Science, AWS Certified Solutions Architect',
                    coreTeam: [
                        { name: 'Vikram Joshi', role: 'Technical Lead', pic: '/assets/members/vikram.jpg' },
                        { name: 'Neha Patil', role: 'Events Coordinator', pic: '/assets/members/neha.jpg' },
                        { name: 'Aditya Rao', role: 'Content Creator', pic: '/assets/members/aditya.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/aws-event1.jpg',
                        '/assets/clubs/aws-event2.jpg',
                        '/assets/clubs/aws-event3.jpg'
                    ]
                },
                {
                    id: 2,
                    name: 'GFG Club',
                    logo: '/assets/clubs/gfg-club.jpg',
                    coverImage: '/assets/clubs/gfg-cover.jpg',
                    category: 'Technical',
                    members: 203,
                    description: 'GeeksforGeeks campus club focused on algorithms, data structures, and competitive programming. Regular coding contests, interview preparation, and problem-solving sessions.',
                    longDescription: 'The GeeksforGeeks Club at MIT ADT is the premier programming club on campus, dedicated to helping students master algorithms, data structures, and competitive programming techniques. Our club hosts weekly coding contests, algorithm deep-dive sessions, and mock technical interviews. We focus on building problem-solving skills that are essential for technical interviews and competitive programming contests. The club maintains a repository of curated problems and solutions, organizes team-based hackathons, and conducts regular peer code reviews.',
                    foundedYear: 2020,
                    meetingSchedule: 'Every Wednesday, 4:30 PM - 6:30 PM',
                    meetingLocation: 'CS Building, Lab 201',
                    upcomingEvent: 'Code Sprint Challenge',
                    eventDate: '2025-04-18T18:30:00',
                    pastEvents: [
                        { name: 'Dynamic Programming Workshop', date: '2025-03-15' },
                        { name: 'Mock Interview Day', date: '2025-02-18' },
                        { name: 'Algorithm Visualization Hackathon', date: '2025-01-25' }
                    ],
                    achievements: [
                        'Ranked #3 in National Collegiate Programming Contest 2024',
                        'Placed 15+ members in FAANG companies in 2024',
                        'Published an algorithms guidebook used by 3 other universities'
                    ],
                    resources: [
                        { name: 'DSA Roadmap', url: '#' },
                        { name: 'Interview Preparation Guide', url: '#' },
                        { name: 'Competitive Programming Resources', url: '#' }
                    ],
                    socialLinks: {
                        instagram: 'https://instagram.com/gfg_mitadt',
                        twitter: 'https://twitter.com/gfg_mitadt',
                        website: 'https://gfg.mitadt.edu'
                    },
                    contactEmail: 'gfg.club@mitadt.edu',
                    leadName: 'Arjun Mehta',
                    leadProfilePic: '/assets/members/arjun.jpg',
                    leadBio: 'Senior in Computer Engineering, ICPC Regional Finalist',
                    coreTeam: [
                        { name: 'Ananya Jain', role: 'Competitive Programming Lead', pic: '/assets/members/ananya.jpg' },
                        { name: 'Siddharth Roy', role: 'Technical Content Manager', pic: '/assets/members/siddharth.jpg' },
                        { name: 'Meera Patel', role: 'Events Coordinator', pic: '/assets/members/meera.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/gfg-event1.jpg',
                        '/assets/clubs/gfg-event2.jpg',
                        '/assets/clubs/gfg-coding-contest.jpg'
                    ]
                },
                {
                    id: 3,
                    name: 'JavaBrewers Club',
                    logo: '/assets/clubs/java-club.jpeg',
                    coverImage: '/assets/clubs/java-cover.jpg',
                    category: 'Technical',
                    members: 124,
                    description: 'For Java enthusiasts and coffee lovers alike! Learn Java programming from basics to advanced frameworks like Spring Boot and Android development.',
                    longDescription: 'The JavaBrewers Club combines two passions: quality Java programming and excellent coffee. Our sessions cover everything from core Java concepts to enterprise frameworks like Spring Boot and mobile development with Android. We host regular code review sessions, project showcases, and development sprints. Our unique "Code & Coffee" sessions provide a relaxed environment where members collaborate on projects while enjoying premium coffees. The club maintains several open-source projects that members can contribute to, providing real-world development experience.',
                    foundedYear: 2022,
                    meetingSchedule: 'Every Friday, 3:00 PM - 5:00 PM',
                    meetingLocation: 'Innovation Center, Room 105',
                    upcomingEvent: 'Spring Boot Microservices Workshop',
                    eventDate: '2025-04-20T16:00:00',
                    pastEvents: [
                        { name: 'Android App Development Bootcamp', date: '2025-03-05' },
                        { name: 'Java Design Patterns Workshop', date: '2025-02-12' },
                        { name: 'Coffee Brewing Techniques Session', date: '2025-01-20' }
                    ],
                    achievements: [
                        'Created campus attendance app used by 5 departments',
                        'Organized Java Developer Conference with 300+ attendees',
                        'Developed open-source library with 500+ GitHub stars'
                    ],
                    resources: [
                        { name: 'Java Roadmap for Beginners', url: '#' },
                        { name: 'Spring Boot Project Templates', url: '#' },
                        { name: 'Android Development Guides', url: '#' }
                    ],
                    socialLinks: {
                        instagram: 'https://instagram.com/javabrewers',
                        github: 'https://github.com/javabrewers-mit',
                        website: 'https://javabrewers.mitadt.edu'
                    },
                    contactEmail: 'java.brewers@mitadt.edu',
                    leadName: 'Rahul Desai',
                    leadProfilePic: '/assets/members/rahul.jpg',
                    leadBio: 'Senior in Information Technology, Oracle Certified Professional',
                    coreTeam: [
                        { name: 'Deepa Sharma', role: 'Android Development Lead', pic: '/assets/members/deepa.jpg' },
                        { name: 'Ravi Kumar', role: 'Backend Development Lead', pic: '/assets/members/ravi.jpg' },
                        { name: 'Tanvi Mehta', role: 'Community Manager', pic: '/assets/members/tanvi.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/java-workshop.jpg',
                        '/assets/clubs/java-coding-session.jpg',
                        '/assets/clubs/coffee-brewing-session.jpg'
                    ]
                },
                {
                    id: 4,
                    name: 'Cloud Computing Club',
                    logo: '/assets/clubs/cloud-club.png',
                    coverImage: '/assets/clubs/cloud-cover.jpg',
                    category: 'Technical',
                    members: 147,
                    description: 'Explore multi-cloud environments including AWS, Azure, and Google Cloud. Workshops on DevOps, containerization, and cloud architecture design patterns.',
                    longDescription: 'The Cloud Computing Club focuses on providing members with hands-on experience in multi-cloud environments, preparing them for the modern IT landscape. We cover AWS, Azure, and Google Cloud platforms through practical workshops and real-world projects. Our sessions include infrastructure as code, containerization with Docker and Kubernetes, serverless architectures, and cloud security best practices. The club regularly organizes cloud architecture competitions where teams design scalable solutions for real-world problems. We maintain strong industry connections that provide members with networking opportunities and potential internships.',
                    foundedYear: 2021,
                    meetingSchedule: 'Every Monday, 6:00 PM - 8:00 PM',
                    meetingLocation: 'Tech Hub, Room 401',
                    upcomingEvent: 'Multi-Cloud Deployment Strategies',
                    eventDate: '2025-04-22T15:30:00',
                    pastEvents: [
                        { name: 'Kubernetes Workshop', date: '2025-03-18' },
                        { name: 'Cloud Security Best Practices', date: '2025-02-25' },
                        { name: 'Terraform Infrastructure as Code Day', date: '2025-01-15' }
                    ],
                    achievements: [
                        'Won Best Cloud Solution at Regional Hackathon 2024',
                        'Organized Cloud Career Day with 12 tech companies',
                        'Published cloud architecture case studies used by industry professionals'
                    ],
                    resources: [
                        { name: 'Multi-Cloud Comparison Guide', url: '#' },
                        { name: 'DevOps Pipeline Templates', url: '#' },
                        { name: 'Cloud Cost Optimization Strategies', url: '#' }
                    ],
                    socialLinks: {
                        linkedin: 'https://linkedin.com/in/cloud-club-mit',
                        github: 'https://github.com/cloud-club-mit',
                        website: 'https://cloudclub.mitadt.edu'
                    },
                    contactEmail: 'cloud.computing@mitadt.edu',
                    leadName: 'Amit Patel',
                    leadProfilePic: '/assets/members/amit.jpg',
                    leadBio: 'Senior in Computer Science, Multi-Cloud Certified Professional',
                    coreTeam: [
                        { name: 'Shreya Gupta', role: 'Azure Specialist', pic: '/assets/members/shreya.jpg' },
                        { name: 'Karan Singh', role: 'DevOps Lead', pic: '/assets/members/karan.jpg' },
                        { name: 'Leela Nair', role: 'Events Manager', pic: '/assets/members/leela.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/cloud-workshop.jpg',
                        '/assets/clubs/cloud-hackathon.jpg',
                        '/assets/clubs/cloud-career-day.jpg'
                    ]
                },
                {
                    id: 5,
                    name: 'Robotics Club',
                    logo: '/assets/clubs/robotics-club.jpg',
                    coverImage: '/assets/clubs/robotics-cover.jpg',
                    category: 'Technical',
                    members: 89,
                    description: 'Design, build and program robots for competitions and practical applications. Work with Arduino, Raspberry Pi, sensors, and mechanical components.',
                    longDescription: 'The Robotics Club is where engineering meets creativity. Our members design, build, and program robots for various competitions and real-world applications. We work with technologies including Arduino, Raspberry Pi, various sensors, motors, and mechanical components. The club has a well-equipped workshop with 3D printers, soldering stations, and testing areas. We organize hands-on workshops covering topics like circuit design, mechanical assembly, programming microcontrollers, and integration of AI with robotics. The club participates in national robotics competitions and collaborates with industry partners on practical automation projects.',
                    foundedYear: 2019,
                    meetingSchedule: 'Every Saturday, 10:00 AM - 2:00 PM',
                    meetingLocation: 'Engineering Building, Robotics Lab',
                    upcomingEvent: 'Line Following Robot Competition',
                    eventDate: '2025-04-25T12:00:00',
                    pastEvents: [
                        { name: 'Drone Building Workshop', date: '2025-03-22' },
                        { name: 'Autonomous Navigation Challenge', date: '2025-02-15' },
                        { name: 'Robotics Exhibition', date: '2025-01-30' }
                    ],
                    achievements: [
                        'National Robotics Competition 2024 - 2nd Place',
                        'Developed agricultural robot prototype for local farmers',
                        'Published research paper on affordable robotics education'
                    ],
                    resources: [
                        { name: 'Beginner\'s Guide to Arduino', url: '#' },
                        { name: 'Sensor Integration Tutorials', url: '#' },
                        { name: 'Robot Design Templates', url: '#' }
                    ],
                    socialLinks: {
                        instagram: 'https://instagram.com/robotics_mitadt',
                        youtube: 'https://youtube.com/robotics_mitadt',
                        website: 'https://robotics.mitadt.edu'
                    },
                    contactEmail: 'robotics.club@mitadt.edu',
                    leadName: 'Sneha Kumar',
                    leadProfilePic: '/assets/members/sneha.jpg',
                    leadBio: 'Senior in Mechanical Engineering, Robotics Competition Finalist',
                    coreTeam: [
                        { name: 'Ajay Singh', role: 'Hardware Lead', pic: '/assets/members/ajay.jpg' },
                        { name: 'Priyanka Das', role: 'Programming Lead', pic: '/assets/members/priyanka.jpg' },
                        { name: 'Rohan Verma', role: 'Design Lead', pic: '/assets/members/rohan.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/robot-competition.jpg',
                        '/assets/clubs/robot-workshop.jpg',
                        '/assets/clubs/drone-building.jpg'
                    ]
                },
                {
                    id: 6,
                    name: 'Photography Club',
                    logo: '/assets/clubs/photo-club.jpg',
                    coverImage: '/assets/clubs/photo-cover.jpg',
                    category: 'Arts',
                    members: 112,
                    description: 'For photography enthusiasts of all skill levels. Weekly photo walks, editing workshops, and semester-end exhibitions to showcase student work.',
                    longDescription: 'The Photography Club welcomes enthusiasts of all skill levels, from beginners to advanced photographers. Our activities include weekly photo walks around campus and nearby locations, editing workshops using professional software, and gear sharing among members. We organize themed photography challenges, guest lectures by professional photographers, and semester-end exhibitions to showcase student work. The club maintains a well-equipped studio space with lighting equipment that members can reserve. We collaborate with other campus clubs to document events and create visual content, providing members with practical experience in event photography.',
                    foundedYear: 2018,
                    meetingSchedule: 'Every Thursday, 5:00 PM - 6:30 PM',
                    meetingLocation: 'Arts Building, Studio 204',
                    upcomingEvent: 'Campus Night Photography Workshop',
                    eventDate: '2025-04-16T19:00:00',
                    pastEvents: [
                        { name: 'Portrait Photography Masterclass', date: '2025-03-12' },
                        { name: 'Photo Editing with Lightroom Workshop', date: '2025-02-20' },
                        { name: 'Winter Photography Exhibition', date: '2025-01-10' }
                    ],
                    achievements: [
                        'Won Best College Photography Club Award 2024',
                        'Published photo book featuring student work',
                        'Organized photography exhibition visited by 1000+ people'
                    ],
                    resources: [
                        { name: 'Photography Basics Guide', url: '#' },
                        { name: 'Lightroom Presets Collection', url: '#' },
                        { name: 'Composition Techniques', url: '#' }
                    ],
                    socialLinks: {
                        instagram: 'https://instagram.com/lens_mitadt',
                        flickr: 'https://flickr.com/groups/mitadt_photos',
                        website: 'https://photoclub.mitadt.edu'
                    },
                    contactEmail: 'photo.club@mitadt.edu',
                    leadName: 'Nisha Gupta',
                    leadProfilePic: '/assets/members/nisha.jpg',
                    leadBio: 'Senior in Visual Arts, Professional Photographer',
                    coreTeam: [
                        { name: 'Dev Patel', role: 'Technical Workshop Lead', pic: '/assets/members/dev.jpg' },
                        { name: 'Anjali Mehta', role: 'Events Coordinator', pic: '/assets/members/anjali.jpg' },
                        { name: 'Kunal Sharma', role: 'Exhibition Curator', pic: '/assets/members/kunal.jpg' }
                    ],
                    gallery: [
                        '/assets/clubs/photo-exhibition.jpg',
                        '/assets/clubs/photo-walk.jpg',
                        '/assets/clubs/studio-session.jpg'
                    ]
                }
            ];

            const selectedClub = clubsData.find(c => c.id === parseInt(clubId));
            setClub(selectedClub);
            setEditedClub(JSON.parse(JSON.stringify(selectedClub))); // Create a deep copy for editing
            setLoading(false);
        }, 800);
    }, [clubId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Save changes
            handleSaveChanges();
        } else {
            // Enter edit mode
            setEditedClub(JSON.parse(JSON.stringify(club))); // Create a fresh copy
            setEditMode(true);
        }
    };

    const handleSaveChanges = () => {
        // Here you would send the updates to your backend
        setClub(editedClub);
        setEditMode(false);
        alert('Changes saved successfully!');
        // In a real app: API call to update the club info
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedClub(JSON.parse(JSON.stringify(club))); // Reset to original
    };

    const handleInputChange = (e, section, field, index = null) => {
        const newEditedClub = { ...editedClub };

        if (section === null) {
            // Direct field in club object
            newEditedClub[field] = e.target.value;
        } else if (index !== null) {
            // Array item
            if (field === null) {
                // Simple array of strings (like achievements)
                newEditedClub[section][index] = e.target.value;
            } else {
                // Array of objects (like pastEvents, coreTeam)
                newEditedClub[section][index][field] = e.target.value;
            }
        } else if (field === null) {
            // Entire section value
            newEditedClub[section] = e.target.value;
        } else {
            // Nested object field (like socialLinks)
            newEditedClub[section][field] = e.target.value;
        }

        setEditedClub(newEditedClub);
    };

    const handleAddItem = (section, template) => {
        const newEditedClub = { ...editedClub };
        newEditedClub[section].push(template);
        setEditedClub(newEditedClub);
    };

    const handleRemoveItem = (section, index) => {
        const newEditedClub = { ...editedClub };
        newEditedClub[section].splice(index, 1);
        setEditedClub(newEditedClub);
    };

    const handleAddToGallery = () => {
        // In a real app, you would upload the image to your server
        const imageUrl = prompt("Enter image URL or upload path:");
        if (imageUrl) {
            const newEditedClub = { ...editedClub };
            if (!newEditedClub.gallery) {
                newEditedClub.gallery = [];
            }
            newEditedClub.gallery.push(imageUrl);
            setEditedClub(newEditedClub);
        }
    };

    const handleRemoveFromGallery = (index) => {
        const newEditedClub = { ...editedClub };
        newEditedClub.gallery.splice(index, 1);
        setEditedClub(newEditedClub);
    };

    const handleAddResource = () => {
        const name = prompt("Enter resource name:");
        const url = prompt("Enter resource URL:");

        if (name && url) {
            const newEditedClub = { ...editedClub };
            if (!newEditedClub.resources) {
                newEditedClub.resources = [];
            }
            newEditedClub.resources.push({ name, url });
            setEditedClub(newEditedClub);
        }
    };

    // Handle removing a resource
    const handleRemoveResource = (index) => {
        const newEditedClub = { ...editedClub };
        newEditedClub.resources.splice(index, 1);
        setEditedClub(newEditedClub);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading club information...</p>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="error-container">
                <i className="fas fa-exclamation-circle"></i>
                <h2>Club Not Found</h2>
                <p>The club you're looking for doesn't exist or has been removed.</p>
                <button className="btn" onClick={() => navigate('/clubs')}>
                    Back to Clubs
                </button>
            </div>
        );
    }

    // Use the active club data based on edit mode
    const activeClub = editMode ? editedClub : club;

    return (
        <div className="club-detail-page">
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>

            <div className="container">
                {/* Back button */}
                <button className="back-home-button" onClick={() => navigate('/clubs')}> Back to Clubs
                </button>

                {/* Club header with cover image */}
                <div className="club-cover-section">
                    <div className="club-cover-image" style={{ backgroundImage: `url(${activeClub.coverImage})` }}>
                        <div className="club-cover-overlay"></div>
                        {editMode && (
                            <button
                                className="edit-image-btn"
                                onClick={() => {
                                    const newUrl = prompt("Enter new cover image URL:", activeClub.coverImage);
                                    if (newUrl) {
                                        setEditedClub({ ...editedClub, coverImage: newUrl });
                                    }
                                }}
                            >
                                <i className="fas fa-camera"></i> Change Cover
                            </button>
                        )}
                    </div>

                    <div className="club-header-content">
                        <div className="club-logo-large">
                            <img src={activeClub.logo} alt={`${activeClub.name} Logo`} onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/default-club-logo.jpg";
                            }} />
                            {editMode && (
                                <button
                                    className="edit-logo-btn"
                                    onClick={() => {
                                        const newUrl = prompt("Enter new logo URL:", activeClub.logo);
                                        if (newUrl) {
                                            setEditedClub({ ...editedClub, logo: newUrl });
                                        }
                                    }}
                                >
                                    <i className="fas fa-camera"></i>
                                </button>
                            )}
                        </div>

                        <div className="club-title-section">
                            {editMode ? (
                                <input
                                    type="text"
                                    className="edit-title-input"
                                    value={activeClub.name}
                                    onChange={(e) => handleInputChange(e, null, 'name')}
                                />
                            ) : (
                                <h1>{activeClub.name}</h1>
                            )}

                            <div className="club-category-badge">
                                {editMode ? (
                                    <select
                                        value={activeClub.category}
                                        onChange={(e) => handleInputChange(e, null, 'category')}
                                    >
                                        <option>Technical</option>
                                        <option>Cultural</option>
                                        <option>Sports</option>
                                        <option>Academic</option>
                                        <option>Social</option>
                                    </select>
                                ) : (
                                    activeClub.category
                                )}
                            </div>

                            <div className="club-meta">
                                <span>
                                    <i className="fas fa-users"></i>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            className="edit-small-input"
                                            value={activeClub.members}
                                            onChange={(e) => handleInputChange(e, null, 'members')}
                                        />
                                    ) : (
                                        `${activeClub.members} members`
                                    )}
                                </span>
                                <span>
                                    <i className="fas fa-calendar-alt"></i> Founded
                                    {editMode ? (
                                        <input
                                            type="number"
                                            className="edit-small-input"
                                            value={activeClub.foundedYear}
                                            onChange={(e) => handleInputChange(e, null, 'foundedYear')}
                                        />
                                    ) : (
                                        ` ${activeClub.foundedYear}`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="club-action-buttons">
                            <button
                                className={`btn ${editMode ? 'save-info-btn' : 'modify-info-btn'}`}
                                onClick={handleEditToggle}
                            >
                                {editMode ? (
                                    <>
                                        <i className="fas fa-save"></i> Save Changes
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-edit"></i> Modify Info
                                    </>
                                )}
                            </button>

                            {editMode && (
                                <button className="btn cancel-btn" onClick={handleCancelEdit}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            )}

                            <button className="btn share-btn">
                                <i className="fas fa-share-alt"></i> Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation tabs */}
                <div className="club-nav-tabs">
                    <div
                        className={`club-nav-tab ${activeTab === 'about' ? 'active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        <i className="fas fa-info-circle"></i> About
                    </div>
                    <div
                        className={`club-nav-tab ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        <i className="fas fa-calendar-week"></i> Events
                    </div>
                    <div
                        className={`club-nav-tab ${activeTab === 'members' ? 'active' : ''}`}
                        onClick={() => setActiveTab('members')}
                    >
                        <i className="fas fa-users"></i> Members
                    </div>
                    <div
                        className={`club-nav-tab ${activeTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gallery')}
                    >
                        <i className="fas fa-images"></i> Gallery
                    </div>
                    <div
                        className={`club-nav-tab ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        <i className="fas fa-book"></i> Resources
                    </div>
                </div>

                {/* Main content */}
                <div className="club-content">
                    {/* About tab */}
                    {activeTab === 'about' && (
                        <div className="about-section">
                            <div className="club-description-box">
                                <h3>About the Club</h3>
                                {editMode ? (
                                    <textarea
                                        className="edit-long-text"
                                        value={activeClub.longDescription}
                                        onChange={(e) => handleInputChange(e, null, 'longDescription')}
                                        rows={6}
                                    />
                                ) : (
                                    <p>{activeClub.longDescription}</p>
                                )}

                                <div className="club-details-grid">
                                    <div className="detail-item">
                                        <h4><i className="fas fa-clock"></i> Meeting Schedule</h4>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={activeClub.meetingSchedule}
                                                onChange={(e) => handleInputChange(e, null, 'meetingSchedule')}
                                            />
                                        ) : (
                                            <p>{activeClub.meetingSchedule}</p>
                                        )}
                                    </div>
                                    <div className="detail-item">
                                        <h4><i className="fas fa-map-marker-alt"></i> Location</h4>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={activeClub.meetingLocation}
                                                onChange={(e) => handleInputChange(e, null, 'meetingLocation')}
                                            />
                                        ) : (
                                            <p>{activeClub.meetingLocation}</p>
                                        )}
                                    </div>
                                    <div className="detail-item">
                                        <h4><i className="fas fa-envelope"></i> Contact</h4>
                                        {editMode ? (
                                            <input
                                                type="email"
                                                className="edit-input"
                                                value={activeClub.contactEmail}
                                                onChange={(e) => handleInputChange(e, null, 'contactEmail')}
                                            />
                                        ) : (
                                            <p>{activeClub.contactEmail}</p>
                                        )}
                                    </div>
                                    <div className="detail-item">
                                        <h4><i className="fas fa-globe"></i> Social Media</h4>
                                        <div className="social-links-large">
                                            {editMode ? (
                                                <div className="edit-social-links">
                                                    <div className="social-edit-item">
                                                        <i className="fab fa-instagram"></i>
                                                        <input
                                                            type="text"
                                                            value={activeClub.socialLinks.instagram}
                                                            onChange={(e) => handleInputChange(e, 'socialLinks', 'instagram')}
                                                            placeholder="Instagram URL"
                                                        />
                                                    </div>
                                                    <div className="social-edit-item">
                                                        <i className="fab fa-linkedin"></i>
                                                        <input
                                                            type="text"
                                                            value={activeClub.socialLinks.linkedin}
                                                            onChange={(e) => handleInputChange(e, 'socialLinks', 'linkedin')}
                                                            placeholder="LinkedIn URL"
                                                        />
                                                    </div>
                                                    <div className="social-edit-item">
                                                        <i className="fas fa-globe"></i>
                                                        <input
                                                            type="text"
                                                            value={activeClub.socialLinks.website}
                                                            onChange={(e) => handleInputChange(e, 'socialLinks', 'website')}
                                                            placeholder="Website URL"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {activeClub.socialLinks.instagram && (
                                                        <a href={activeClub.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                            <i className="fab fa-instagram"></i>
                                                        </a>
                                                    )}
                                                    {activeClub.socialLinks.linkedin && (
                                                        <a href={activeClub.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <i className="fab fa-linkedin"></i>
                                                        </a>
                                                    )}
                                                    {activeClub.socialLinks.website && (
                                                        <a href={activeClub.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                                            <i className="fas fa-globe"></i>
                                                        </a>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="club-achievements">
                                <h3>Achievements</h3>
                                <ul className="achievements-list">
                                    {activeClub.achievements.map((achievement, index) => (
                                        <li key={index}>
                                            <i className="fas fa-trophy"></i>
                                            {editMode ? (
                                                <div className="edit-list-item">
                                                    <input
                                                        type="text"
                                                        value={achievement}
                                                        onChange={(e) => handleInputChange(e, 'achievements', null, index)}
                                                    />
                                                    <button
                                                        className="remove-item-btn"
                                                        onClick={() => handleRemoveItem('achievements', index)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span>{achievement}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {editMode && (
                                    <button
                                        className="add-item-btn"
                                        onClick={() => handleAddItem('achievements', 'New Achievement')}
                                    >
                                        <i className="fas fa-plus"></i> Add Achievement
                                    </button>
                                )}
                            </div>

                            <div className="leadership-section">
                                <h3>Leadership Team</h3>

                                <div className="club-leader">
                                    <div className="leader-photo">
                                        <img
                                            src={activeClub.leadProfilePic}
                                            alt={activeClub.leadName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/default-profile.jpg";
                                            }}
                                        />
                                        {editMode && (
                                            <button
                                                className="edit-photo-btn"
                                                onClick={() => {
                                                    const newUrl = prompt("Enter new profile picture URL:", activeClub.leadProfilePic);
                                                    if (newUrl) {
                                                        setEditedClub({ ...editedClub, leadProfilePic: newUrl });
                                                    }
                                                }}
                                            >
                                                <i className="fas fa-camera"></i>
                                            </button>
                                        )}
                                    </div>
                                    <div className="leader-info">
                                        {editMode ? (
                                            <input
                                                type="text"
                                                className="edit-name-input"
                                                value={activeClub.leadName}
                                                onChange={(e) => handleInputChange(e, null, 'leadName')}
                                            />
                                        ) : (
                                            <h4>{activeClub.leadName}</h4>
                                        )}
                                        <p className="leader-role">Club President</p>
                                        {editMode ? (
                                            <textarea
                                                className="edit-bio-text"
                                                value={activeClub.leadBio}
                                                onChange={(e) => handleInputChange(e, null, 'leadBio')}
                                                rows={2}
                                            />
                                        ) : (
                                            <p className="leader-bio">{activeClub.leadBio}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="core-team">
                                    <h4>Core Team</h4>
                                    <div className="team-members-grid">
                                        {activeClub.coreTeam.map((member, index) => (
                                            <div className="team-member" key={index}>
                                                <div className="member-photo">
                                                    <img
                                                        src={member.pic}
                                                        alt={member.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/assets/default-profile.jpg";
                                                        }}
                                                    />
                                                    {editMode && (
                                                        <button
                                                            className="edit-photo-btn"
                                                            onClick={() => {
                                                                const newUrl = prompt("Enter new profile picture URL:", member.pic);
                                                                if (newUrl) {
                                                                    const newTeam = [...editedClub.coreTeam];
                                                                    newTeam[index].pic = newUrl;
                                                                    setEditedClub({ ...editedClub, coreTeam: newTeam });
                                                                }
                                                            }}
                                                        >
                                                            <i className="fas fa-camera"></i>
                                                        </button>
                                                    )}
                                                </div>
                                                {editMode ? (
                                                    <div className="edit-team-member">
                                                        <input
                                                            type="text"
                                                            value={member.name}
                                                            onChange={(e) => handleInputChange(e, 'coreTeam', 'name', index)}
                                                            placeholder="Name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={member.role}
                                                            onChange={(e) => handleInputChange(e, 'coreTeam', 'role', index)}
                                                            placeholder="Role"
                                                        />
                                                        <button
                                                            className="remove-member-btn"
                                                            onClick={() => handleRemoveItem('coreTeam', index)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h5>{member.name}</h5>
                                                        <p>{member.role}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        {editMode && (
                                            <div className="add-team-member">
                                                <button
                                                    onClick={() => handleAddItem('coreTeam', {
                                                        name: 'New Member',
                                                        role: 'Role',
                                                        pic: '/assets/default-profile.jpg'
                                                    })}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                    <span>Add Team Member</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Events tab */}
                    {activeTab === 'events' && (
                        <div className="events-section">
                            <div className="upcoming-event">
                                <h3>Upcoming Event</h3>
                                <div className="event-card featured">
                                    <div className="event-date-badge">
                                        {editMode ? (
                                            <input
                                                type="datetime-local"
                                                className="edit-date-input"
                                                value={activeClub.eventDate.slice(0, 16)} // Format for datetime-local input
                                                onChange={(e) => handleInputChange(e, null, 'eventDate')}
                                            />
                                        ) : (
                                            <>
                                                <div className="date-month">
                                                    {new Date(activeClub.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="date-day">
                                                    {new Date(activeClub.eventDate).getDate()}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="event-details">
                                        {editMode ? (
                                            <input
                                                type="text"
                                                className="edit-event-name"
                                                value={activeClub.upcomingEvent}
                                                onChange={(e) => handleInputChange(e, null, 'upcomingEvent')}
                                            />
                                        ) : (
                                            <h4>{activeClub.upcomingEvent}</h4>
                                        )}
                                        <p className="event-time">
                                            <i className="far fa-clock"></i>
                                            {new Date(activeClub.eventDate).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="event-location">
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    className="edit-location-input"
                                                    value={activeClub.meetingLocation}
                                                    onChange={(e) => handleInputChange(e, null, 'meetingLocation')}
                                                />
                                            ) : (
                                                <>
                                                    <i className="fas fa-map-marker-alt"></i> {activeClub.meetingLocation}
                                                </>
                                            )}
                                        </p>
                                        {!editMode && (
                                            <button className="btn rsvp-btn">
                                                <i className="fas fa-calendar-plus"></i> RSVP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="past-events">
                                <h3>Past Events</h3>

                                {activeClub.pastEvents.length > 0 ? (
                                    <div className="past-events-list">
                                        {activeClub.pastEvents.map((event, index) => (
                                            <div className="event-card past" key={index}>
                                                <div className="event-date-badge past">
                                                    {editMode ? (
                                                        <input
                                                            type="date"
                                                            className="edit-date-input"
                                                            value={event.date.slice(0, 10)} // Format for date input
                                                            onChange={(e) => handleInputChange(e, 'pastEvents', 'date', index)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <div className="date-month">
                                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                                            </div>
                                                            <div className="date-day">
                                                                {new Date(event.date).getDate()}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="event-details">
                                                    {editMode ? (
                                                        <div className="edit-past-event">
                                                            <input
                                                                type="text"
                                                                className="edit-event-name"
                                                                value={event.name}
                                                                onChange={(e) => handleInputChange(e, 'pastEvents', 'name', index)}
                                                            />
                                                            <button
                                                                className="remove-event-btn"
                                                                onClick={() => handleRemoveItem('pastEvents', index)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <h4>{event.name}</h4>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-events-message">No past events recorded.</p>
                                )}

                                {editMode && (
                                    <button
                                        className="add-event-btn"
                                        onClick={() => handleAddItem('pastEvents', {
                                            name: 'New Event',
                                            date: new Date().toISOString().slice(0, 10)
                                        })}
                                    >
                                        <i className="fas fa-plus"></i> Add Past Event
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="gallery-section">
                            <h3>Club Photo Gallery</h3>
                            <div className="photo-gallery">
                                {activeClub.gallery && activeClub.gallery.map((image, index) => (
                                    <div className="gallery-item" key={index}>
                                        <img
                                            src={image}
                                            alt={`Club activity ${index + 1}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/default-image.jpg";
                                            }}
                                        />
                                        {editMode && (
                                            <button
                                                className="remove-image-btn"
                                                onClick={() => handleRemoveFromGallery(index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {editMode && (
                                    <div className="add-gallery-item">
                                        <button onClick={handleAddToGallery}>
                                            <i className="fas fa-plus"></i>
                                            <span>Add Photo</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div className="resources-section">
                            <h3>Club Resources</h3>
                            <div className="resources-list">
                                {activeClub.resources && activeClub.resources.map((resource, index) => (
                                    <div className="resource-item" key={index}>
                                        {editMode ? (
                                            <div className="edit-resource">
                                                <input
                                                    type="text"
                                                    value={resource.name}
                                                    onChange={(e) => handleInputChange(e, 'resources', 'name', index)}
                                                    placeholder="Resource Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={resource.url}
                                                    onChange={(e) => handleInputChange(e, 'resources', 'url', index)}
                                                    placeholder="Resource URL"
                                                />
                                                <button
                                                    className="remove-resource-btn"
                                                    onClick={() => handleRemoveResource(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                <i className="fas fa-file-alt"></i>
                                                <span>{resource.name}</span>
                                            </a>
                                        )}
                                    </div>
                                ))}

                                {editMode && (
                                    <button
                                        className="add-resource-btn"
                                        onClick={handleAddResource}
                                    >
                                        <i className="fas fa-plus"></i> Add Resource
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="members-section">
                            <h3>Club Members</h3>
                            <p className="members-count">Total members: {editMode ? (
                                <input
                                    type="number"
                                    className="edit-small-input"
                                    value={activeClub.members}
                                    onChange={(e) => handleInputChange(e, null, 'members')}
                                />
                            ) : activeClub.members}</p>

                            <div className="member-stats">
                                <p>This section would typically show a list of club members.
                                    Since the current data doesn't include a full member list,
                                    this would be implemented when that data is available.</p>

                                {editMode && (
                                    <button className="btn">
                                        <i className="fas fa-user-plus"></i> Add Member
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
                <footer>
                    <p>&copy; 2025 College Buddy App. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default ClubDetailPage;