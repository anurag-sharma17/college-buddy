const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['student', 'teacher'], required: true },
  enrollmentNumber: { type: String, required: function () { return this.type === 'student'; } },
  employeeId: { type: String, required: function () { return this.type === 'teacher'; } },
  clubId: { type: String },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
