import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./css/StudyGroups.css";

function StudyGroups() {
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    subject: "",
    description: "",
    maxMembers: 10,
    meetingSchedule: {
      day: "",
      time: "",
      location: "",
    },
    tags: "",
  });

  useEffect(() => {
    fetchStudyGroups();
  }, [currentUser]);

  const fetchStudyGroups = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/study-groups");
      const data = await response.json();
      if (data.success) {
        setStudyGroups(data.data);
      }
    } catch (error) {
      console.error("Error fetching study groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login to create a study group");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/study-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Study group created successfully!");
        setShowCreateModal(false);
        fetchStudyGroups();
        setFormData({
          name: "",
          course: "",
          subject: "",
          description: "",
          maxMembers: 10,
          meetingSchedule: { day: "", time: "", location: "" },
          tags: "",
        });
      } else {
        alert(data.message || "Failed to create study group");
      }
    } catch (error) {
      console.error("Error creating study group:", error);
      alert("Error creating study group");
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!currentUser) {
      alert("Please login to join a study group");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/study-groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Successfully joined the study group!");
        fetchStudyGroups();
      } else {
        alert(data.message || "Failed to join study group");
      }
    } catch (error) {
      console.error("Error joining study group:", error);
      alert("Error joining study group");
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/study-groups/${groupId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Successfully left the study group");
        fetchStudyGroups();
      } else {
        alert(data.message || "Failed to leave study group");
      }
    } catch (error) {
      console.error("Error leaving study group:", error);
      alert("Error leaving study group");
    }
  };

  const isMember = (group) => {
    if (!currentUser) return false;
    return group.members.some(
      (member) =>
        member._id === currentUser.id || member._id === currentUser._id
    );
  };

  const filteredGroups = studyGroups.filter((group) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && group.status === "active") ||
      (filter === "my-groups" && isMember(group));

    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="study-groups-container">
      <div className="bg"></div>

      <div className="study-groups-header">
        <button className="back-button" onClick={() => navigate("/home")}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h1>
          <i className="fas fa-user-graduate"></i> Peer Study Groups
        </h1>
        <p>Connect with fellow students for collaborative learning</p>
      </div>

      <div className="study-groups-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, course, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Groups
            </button>
            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={filter === "my-groups" ? "active" : ""}
              onClick={() => setFilter("my-groups")}
            >
              My Groups
            </button>
          </div>
        </div>

        <button
          className="create-group-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> Create Study Group
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading study groups...</div>
      ) : (
        <div className="study-groups-grid">
          {filteredGroups.length === 0 ? (
            <div className="no-groups">
              <i className="fas fa-users"></i>
              <p>No study groups found</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group._id} className="study-group-card">
                <div className="group-header">
                  <h3>{group.name}</h3>
                  <span className={`status-badge ${group.status}`}>
                    {group.status}
                  </span>
                </div>

                <div className="group-info">
                  <p>
                    <strong>Course:</strong> {group.course}
                  </p>
                  <p>
                    <strong>Subject:</strong> {group.subject}
                  </p>
                  <p className="description">{group.description}</p>
                </div>

                <div className="group-details">
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <span>Creator: {group.createdBy?.name || "Unknown"}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-users"></i>
                    <span>{group.members.length} members</span>
                  </div>
                  {group.meetingSchedule?.day && (
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>
                        {group.meetingSchedule.day} at{" "}
                        {group.meetingSchedule.time}
                      </span>
                    </div>
                  )}
                  {group.meetingSchedule?.location && (
                    <div className="detail-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{group.meetingSchedule.location}</span>
                    </div>
                  )}
                </div>

                {group.tags && group.tags.length > 0 && (
                  <div className="group-tags">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="group-actions">
                  {currentUser && isMember(group) ? (
                    <>
                      <span className="member-badge">
                        <i className="fas fa-check-circle"></i> Member
                      </span>
                      {group.createdBy._id !== currentUser.id &&
                        group.createdBy._id !== currentUser._id && (
                          <button
                            className="leave-btn"
                            onClick={() => handleLeaveGroup(group._id)}
                          >
                            Leave Group
                          </button>
                        )}
                    </>
                  ) : (
                    <button
                      className="join-btn"
                      onClick={() => handleJoinGroup(group._id)}
                      disabled={group.status === "full"}
                    >
                      {group.status === "full" ? "Group Full" : "Join Group"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Study Group</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Group Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Data Structures Study Group"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="e.g., Data Structures"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the purpose and goals of this study group..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Max Members</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={formData.maxMembers}
                  onChange={(e) =>
                    setFormData({ ...formData, maxMembers: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <h3>Meeting Schedule (Optional)</h3>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Day (e.g., Monday)"
                    value={formData.meetingSchedule.day}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meetingSchedule: {
                          ...formData.meetingSchedule,
                          day: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g., 3:00 PM)"
                    value={formData.meetingSchedule.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meetingSchedule: {
                          ...formData.meetingSchedule,
                          time: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location (e.g., Library Room 201)"
                  value={formData.meetingSchedule.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetingSchedule: {
                        ...formData.meetingSchedule,
                        location: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g., algorithms, coding, exam-prep"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyGroups;
