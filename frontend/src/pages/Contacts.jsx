import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Contacts.css";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Department",
    "Faculty",
    "Administrative",
    "Emergency",
    "Student Services",
    "Other",
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [selectedCategory, searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contacts");
      const data = await response.json();
      console.log("Contacts API Response:", data);
      if (data.success) {
        console.log("Setting contacts:", data.data);
        setContacts(data.data);
        setFilteredContacts(data.data);
      } else {
        console.log("API call was not successful:", data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;
    console.log("Filtering contacts. Total contacts:", contacts.length);
    console.log("Selected category:", selectedCategory);
    console.log("Search term:", searchTerm);

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (contact) => contact.category === selectedCategory
      );
      console.log("After category filter:", filtered.length);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.department
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contact.designation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    console.log("Final filtered contacts:", filtered.length);
    setFilteredContacts(filtered);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Department: "fas fa-building",
      Faculty: "fas fa-chalkboard-teacher",
      Administrative: "fas fa-user-tie",
      Emergency: "fas fa-ambulance",
      "Student Services": "fas fa-hands-helping",
      Other: "fas fa-info-circle",
    };
    return icons[category] || "fas fa-address-book";
  };

  return (
    <div className="contacts-container">
      <div className="bg"></div>

      <div className="contacts-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1>
          <i className="fas fa-address-book"></i> Contact Information
        </h1>
        <p>Quick access to essential campus contacts</p>
      </div>

      <div className="contacts-controls">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, department, designation, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading contacts...</div>
      ) : (
        <div className="contacts-grid">
          {filteredContacts.length === 0 ? (
            <div className="no-contacts">
              <i className="fas fa-address-book"></i>
              <p>No contacts found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div key={contact._id} className="contact-card">
                <div className="contact-header">
                  <div className="contact-icon">
                    <i className={getCategoryIcon(contact.category)}></i>
                  </div>
                  <span className="category-badge">{contact.category}</span>
                </div>

                <div className="contact-body">
                  <h3>{contact.name}</h3>
                  {contact.designation && (
                    <p className="designation">{contact.designation}</p>
                  )}
                  {contact.department && (
                    <p className="department">
                      <i className="fas fa-building"></i> {contact.department}
                    </p>
                  )}
                  {contact.description && (
                    <p className="description">{contact.description}</p>
                  )}
                </div>

                <div className="contact-details">
                  {contact.email && (
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </div>
                  )}
                  {contact.officeLocation && (
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{contact.officeLocation}</span>
                    </div>
                  )}
                  {contact.officeHours && (
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{contact.officeHours}</span>
                    </div>
                  )}
                  {contact.website && (
                    <div className="detail-item">
                      <i className="fas fa-globe"></i>
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {contact.socialMedia &&
                  Object.values(contact.socialMedia).some((val) => val) && (
                    <div className="social-links">
                      {contact.socialMedia.facebook && (
                        <a
                          href={contact.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-facebook"></i>
                        </a>
                      )}
                      {contact.socialMedia.twitter && (
                        <a
                          href={contact.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                      {contact.socialMedia.linkedin && (
                        <a
                          href={contact.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {contact.socialMedia.instagram && (
                        <a
                          href={contact.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                    </div>
                  )}

                <div className="contact-actions">
                  {contact.email && (
                    <button
                      className="action-btn email-btn"
                      onClick={() =>
                        (window.location.href = `mailto:${contact.email}`)
                      }
                    >
                      <i className="fas fa-envelope"></i> Email
                    </button>
                  )}
                  {contact.phone && (
                    <button
                      className="action-btn call-btn"
                      onClick={() =>
                        (window.location.href = `tel:${contact.phone}`)
                      }
                    >
                      <i className="fas fa-phone"></i> Call
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Emergency Contacts Section */}
      {contacts.some((c) => c.category === "Emergency") && (
        <div className="emergency-section">
          <h2>
            <i className="fas fa-exclamation-triangle"></i> Emergency Contacts
          </h2>
          <div className="emergency-grid">
            {contacts
              .filter((c) => c.category === "Emergency")
              .map((contact) => (
                <div key={contact._id} className="emergency-card">
                  <h3>{contact.name}</h3>
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="emergency-phone"
                    >
                      <i className="fas fa-phone"></i> {contact.phone}
                    </a>
                  )}
                  {contact.description && <p>{contact.description}</p>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;
