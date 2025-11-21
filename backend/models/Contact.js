const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "Department",
      "Faculty",
      "Administrative",
      "Emergency",
      "Student Services",
      "Other",
    ],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  officeLocation: {
    type: String,
    trim: true,
  },
  officeHours: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  description: {
    type: String,
  },
  priority: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
contactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Contact", contactSchema);
