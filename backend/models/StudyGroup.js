const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      email: String,
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  maxMembers: {
    type: Number,
    default: 10,
  },
  meetingSchedule: {
    day: String,
    time: String,
    location: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "full"],
    default: "active",
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the status when members reach max
studyGroupSchema.pre("save", function (next) {
  if (this.members.length >= this.maxMembers) {
    this.status = "full";
  } else if (this.status === "full" && this.members.length < this.maxMembers) {
    this.status = "active";
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
