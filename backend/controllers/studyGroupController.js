const mongoose = require("mongoose");

// Get all study groups
exports.getAllStudyGroups = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const { course, subject, status } = req.query;
    let filter = {};

    if (course) filter.course = course;
    if (subject) filter.subject = subject;
    if (status) filter.status = status;

    const studyGroups = await StudyGroup.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: studyGroups.length,
      data: studyGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching study groups",
      error: error.message,
    });
  }
};

// Get a single study group by ID
exports.getStudyGroupById = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroup = await StudyGroup.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    res.status(200).json({
      success: true,
      data: studyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching study group",
      error: error.message,
    });
  }
};

// Create a new study group
exports.createStudyGroup = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const {
      name,
      course,
      subject,
      description,
      maxMembers,
      meetingSchedule,
      tags,
    } = req.body;

    // Get user info from auth middleware
    const creator = req.user._id;

    const studyGroup = new StudyGroup({
      name,
      course,
      subject,
      description,
      maxMembers: maxMembers || 10,
      meetingSchedule,
      tags: tags || [],
      createdBy: creator,
      members: [creator],
      status: "active",
    });

    await studyGroup.save();

    // Populate the response with user details
    await studyGroup.populate("createdBy", "name email");
    await studyGroup.populate("members", "name email");

    res.status(201).json({
      success: true,
      message: "Study group created successfully",
      data: studyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating study group",
      error: error.message,
    });
  }
};

// Join a study group
exports.joinStudyGroup = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    // Check if already a member
    const isMember = studyGroup.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this group",
      });
    }

    // Add member
    studyGroup.members.push(req.user._id);

    await studyGroup.save();

    // Populate the response with user details
    await studyGroup.populate("createdBy", "name email");
    await studyGroup.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Successfully joined the study group",
      data: studyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error joining study group",
      error: error.message,
    });
  }
};

// Leave a study group
exports.leaveStudyGroup = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    // Check if user is creator
    if (studyGroup.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Creator cannot leave the group. Delete the group instead.",
      });
    }

    // Remove member
    studyGroup.members = studyGroup.members.filter(
      (member) => member.toString() !== req.user._id.toString()
    );

    await studyGroup.save();

    // Populate the response with user details
    await studyGroup.populate("createdBy", "name email");
    await studyGroup.populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Successfully left the study group",
      data: studyGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error leaving study group",
      error: error.message,
    });
  }
};

// Update a study group
exports.updateStudyGroup = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    // Check if user is creator
    if (studyGroup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can update this group",
      });
    }

    const updatedGroup = await StudyGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Study group updated successfully",
      data: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating study group",
      error: error.message,
    });
  }
};

// Delete a study group
exports.deleteStudyGroup = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroup = await StudyGroup.findById(req.params.id);

    if (!studyGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found",
      });
    }

    // Check if user is creator
    if (studyGroup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can delete this group",
      });
    }

    await StudyGroup.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Study group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting study group",
      error: error.message,
    });
  }
};

// Get user's study groups
exports.getUserStudyGroups = async (req, res) => {
  try {
    const StudyGroup = mongoose.model("StudyGroup");
    const studyGroups = await StudyGroup.find({
      members: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: studyGroups.length,
      data: studyGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user study groups",
      error: error.message,
    });
  }
};
