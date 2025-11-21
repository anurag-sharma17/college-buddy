const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cabinNo: { type: String },
    phone: { type: String },
    available: { type: Boolean, default: true },
    timetable: [{ type: Object }],
    timetableImage: { type: String }, // Added for timetable image
    employeeId: { type: String, required: true },
    clubId: { type: String }
  });

module.exports = mongoose.model('Teacher', teacherSchema);
