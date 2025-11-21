const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
require('dotenv').config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, type, enrollmentNumber, employeeId, clubId } = req.body;

    // Validate input
    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    if (type === 'student' && !enrollmentNumber) {
      return res.status(400).json({ error: 'Enrollment number is required for students' });
    }

    if (type === 'teacher' && !employeeId) {
      return res.status(400).json({ error: 'Employee ID is required for teachers' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      type,
      enrollmentNumber: type === 'student' ? enrollmentNumber : undefined,
      employeeId: type === 'teacher' ? employeeId : undefined,
      clubId
    });

    await user.save();

    // If teacher, create teacher profile
    if (type === 'teacher') {
      const teacher = new Teacher({
        name,
        email,
        employeeId,
        clubId
      });
      await teacher.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user._id, name, email, type } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, type: user.type } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetExpiry = Date.now() + 3600000; // 1 hour

    // Save token and expiry
    user.resetToken = resetToken;
    user.resetExpiry = resetExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for College Buddy.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({
      email,
      resetToken: token,
      resetExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      type: req.user.type,
      enrollmentNumber: req.user.enrollmentNumber,
      employeeId: req.user.employeeId,
      clubId: req.user.clubId
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCurrentUser
};
