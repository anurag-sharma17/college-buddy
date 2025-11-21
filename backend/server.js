const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer configuration for file uploads
const upload = multer({ dest: "Uploads/" });
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

// Import routes
const studyGroupRoutes = require("./routes/studyGroupRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ["student", "teacher"], required: true },
  enrollmentNumber: {
    type: String,
    required: function () {
      return this.type === "student";
    },
  },
  employeeId: {
    type: String,
    required: function () {
      return this.type === "teacher";
    },
  },
  clubId: { type: String },
  createdAt: { type: Date, default: Date.now },
  resetToken: { type: String },
  resetExpiry: { type: Date },
  lastLogin: { type: Date },
});

const User = mongoose.model("User", userSchema);

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cabinNo: { type: String },
  phone: { type: String },
  available: { type: Boolean, default: true },
  timetable: [{ type: Object }],
  timetableImage: { type: String },
  employeeId: { type: String, required: true },
  clubId: { type: String },
  subject: { type: String },
  department: { type: String },
  building: { type: String },
  floor: { type: String },
  roomNumber: { type: String },
  image: { type: String },
  timetableDisplayMode: {
    type: String,
    enum: ["manual", "image"],
    default: "manual",
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

// Seating Schema
const seatingSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  cabinNo: { type: String, required: true },
  building: { type: String },
  floor: { type: String },
  roomNumber: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const Seating = mongoose.model("Seating", seatingSchema);

// Club Schema
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  events: [{ title: String, date: Date, description: String }],
  createdAt: { type: Date, default: Date.now },
});

const Club = mongoose.model("Club", clubSchema);

// Resource Schema
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  course: { type: String },
  subject: { type: String },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Resource = mongoose.model("Resource", resourceSchema);

// Study Group Schema
const studyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String },
  subject: { type: String },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  maxMembers: { type: Number, default: 10 },
  meetingSchedule: {
    day: String,
    time: String,
    location: String,
  },
  tags: [String],
  status: {
    type: String,
    enum: ["active", "inactive", "full"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

// Alumni Schema
const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  graduationYear: { type: Number },
  profession: { type: String },
  company: { type: String },
  linkedIn: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Alumni = mongoose.model("Alumni", alumniSchema);

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: {
    type: String,
    required: function () {
      return this.year !== "specialization";
    },
    unique: function () {
      return this.year !== "specialization";
    },
  },
  description: { type: String, required: true },
  instructor: {
    type: String,
    required: function () {
      return this.year !== "specialization";
    },
  },
  credits: { type: Number, required: true, min: 1 },
  documentLink: {
    type: String,
    required: function () {
      return this.year !== "specialization";
    },
  },
  year: {
    type: String,
    enum: ["first", "second", "specialization"],
    required: true,
  },
  specializationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialization",
    required: function () {
      return this.year === "specialization";
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Subject = mongoose.model("Subject", subjectSchema);

const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  year: { type: String, enum: ["third", "fourth"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Specialization = mongoose.model("Specialization", specializationSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  department: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  type: {
    type: String,
    enum: ["faculty", "admin", "emergency"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// Transport Schema
const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  stops: [
    {
      location: { type: String, required: true },
      times: {
        morning: { type: String, required: true },
        evening: { type: String },
      },
    },
  ],
});

const Route = mongoose.model("Route", routeSchema);

// Map Schema
const mapSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Map = mongoose.model("Map", mapSchema);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to verify JWT
const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Please authenticate" });
  }
};

const teacherMiddleware = async (req, res, next) => {
  if (req.user.type !== "teacher") {
    return res
      .status(403)
      .json({ error: "Access denied. Teacher role required." });
  }
  next();
};

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      type,
      enrollmentNumber,
      employeeId,
      clubId,
    } = req.body;

    if (!name || !email || !password || !type) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    if (type === "student" && !enrollmentNumber) {
      return res
        .status(400)
        .json({ error: "Enrollment number is required for students" });
    }

    if (type === "teacher" && !employeeId) {
      return res
        .status(400)
        .json({ error: "Employee ID is required for teachers" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      type,
      enrollmentNumber: type === "student" ? enrollmentNumber : undefined,
      employeeId: type === "teacher" ? employeeId : undefined,
      clubId,
    });

    await user.save();

    if (type === "teacher") {
      const teacher = new Teacher({
        name,
        email,
        employeeId,
        clubId,
        available: true,
        timetable: [],
      });
      await teacher.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return user data in response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        enrollmentNumber: user.enrollmentNumber,
        employeeId: user.employeeId,
        clubId: user.clubId,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Return user data and token in response
    res.json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        lastLogin: user.lastLogin,
        enrollmentNumber: user.enrollmentNumber,
        employeeId: user.employeeId,
        clubId: user.clubId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot password endpoint
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetExpiry = resetExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset for College Buddy.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password endpoint
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({
      email,
      resetToken: token,
      resetExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    type: req.user.type,
    enrollmentNumber: req.user.enrollmentNumber,
    employeeId: req.user.employeeId,
    clubId: req.user.clubId,
    lastLogin: req.user.lastLogin,
  });
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // Expire immediately
  });
  res.json({ message: "Logged out successfully" });
});

// Teacher endpoints
app.get("/api/teachers", authMiddleware, async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/teachers/:email - Fetch a teacher by email
app.get("/api/teachers/:email", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/teachers", authMiddleware, async (req, res) => {
  try {
    const teacher = new Teacher({
      ...req.body,
      available: req.body.available ?? true,
      timetable: req.body.timetable ?? [],
      subject: req.body.subject,
      department: req.body.department,
      building: req.body.building,
      floor: req.body.floor,
      roomNumber: req.body.roomNumber,
      image: req.body.image,
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/teachers/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to update teacher" });
  }
});

app.put("/api/teachers/:id/timetable", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { email: req.params.id }] },
      { timetable: req.body.timetable },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json(teacher);
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/teachers/:email/timetable-image - Upload timetable image
app.put(
  "/api/teachers/:email/timetable-image",
  authMiddleware,
  upload.single("timetableImage"),
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ email: req.params.email });
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      teacher.timetableImage = `/Uploads/${req.file.filename}`;
      await teacher.save();
      res.json(teacher);
    } catch (error) {
      console.error("Error uploading timetable image:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete("/api/teachers/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({
      $or: [{ _id: req.params.id }, { email: req.params.id }],
    });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Seating endpoints
app.get("/api/seating", authMiddleware, async (req, res) => {
  try {
    const seating = await Seating.find().populate(
      "teacherId",
      "name email employeeId"
    );
    res.json(seating);
  } catch (error) {
    console.error("Error fetching seating arrangements:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/seating/:teacherId", authMiddleware, async (req, res) => {
  try {
    const seating = await Seating.findOne({
      teacherId: req.params.teacherId,
    }).populate("teacherId", "name email employeeId");
    if (!seating) {
      return res.status(404).json({ error: "Seating arrangement not found" });
    }
    res.json(seating);
  } catch (error) {
    console.error("Error fetching seating:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Club endpoints
app.get("/api/clubs", async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("leaderId", "name email")
      .populate("members", "name email");
    res.json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/clubs/:id", async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("leaderId", "name email")
      .populate("members", "name email");
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.json(club);
  } catch (error) {
    console.error("Error fetching club:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/clubs/:id/join", authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    if (!club.members.includes(req.user._id)) {
      club.members.push(req.user._id);
      await club.save();
      await User.findByIdAndUpdate(req.user._id, { clubId: req.params.id });
    }
    res.json(club);
  } catch (error) {
    console.error("Error joining club:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Resource endpoints
app.get("/api/resources", async (req, res) => {
  try {
    const resources = await Resource.find().populate(
      "uploadedBy",
      "name email"
    );
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/api/resources",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const resource = new Resource({
        title: req.body.title,
        description: req.body.description,
        fileUrl: req.file ? `/uploads/resources/${req.file.filename}` : null,
        course: req.body.course,
        subject: req.body.subject,
        uploadedBy: req.user._id,
      });
      await resource.save();
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error uploading resource:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Alumni endpoints
app.get("/api/alumni", async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.json(alumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/alumni", authMiddleware, async (req, res) => {
  try {
    const alumni = new Alumni({
      ...req.body,
      email: req.user.email,
    });
    await alumni.save();
    res.status(201).json(alumni);
  } catch (error) {
    console.error("Error adding alumni:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Transport endpoints
app.get("/api/routes", authMiddleware, async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Map endpoints
app.post(
  "/api/maps",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const map = new Map({
        src: `/uploads/maps/${req.file.filename}`,
        alt: req.body.alt || "Campus Map",
      });
      await map.save();
      res.status(201).json(map);
    } catch (error) {
      console.error("Error uploading map:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get("/api/maps", async (req, res) => {
  try {
    const maps = await Map.find();
    res.json(maps);
  } catch (error) {
    console.error("Error fetching maps:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/subjects/:year - Fetch subjects by year
app.get("/api/subjects/:year", authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    if (!["first", "second", "specialization"].includes(year)) {
      return res.status(400).json({ error: "Invalid year" });
    }
    const subjects = await Subject.find({ year });
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/api/subjects",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        code,
        description,
        instructor,
        credits,
        documentLink,
        year,
        specializationId,
      } = req.body;

      if (!["first", "second", "specialization"].includes(year)) {
        return res.status(400).json({ error: "Invalid year" });
      }

      if (year === "specialization" && !specializationId) {
        return res.status(400).json({
          error: "Specialization ID required for specialization subjects",
        });
      }

      if (
        year !== "specialization" &&
        (!code || !instructor || !documentLink)
      ) {
        return res.status(400).json({
          error:
            "Code, instructor, and documentLink required for non-specialization subjects",
        });
      }

      const subject = new Subject({
        name,
        code: year !== "specialization" ? code : undefined,
        description,
        instructor: year !== "specialization" ? instructor : undefined,
        credits,
        documentLink: year !== "specialization" ? documentLink : undefined,
        year,
        specializationId:
          year === "specialization" ? specializationId : undefined,
      });

      await subject.save();
      res.status(201).json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.put(
  "/api/subjects/:id",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        code,
        description,
        instructor,
        credits,
        documentLink,
        year,
        specializationId,
      } = req.body;

      if (!["first", "second", "specialization"].includes(year)) {
        return res.status(400).json({ error: "Invalid year" });
      }

      if (year === "specialization" && !specializationId) {
        return res.status(400).json({
          error: "Specialization ID required for specialization subjects",
        });
      }

      const subject = await Subject.findByIdAndUpdate(
        req.params.id,
        {
          name,
          code: year !== "specialization" ? code : undefined,
          description,
          instructor: year !== "specialization" ? instructor : undefined,
          credits,
          documentLink: year !== "specialization" ? documentLink : undefined,
          year,
          specializationId:
            year === "specialization" ? specializationId : undefined,
        },
        { new: true, runValidators: true }
      );

      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.json(subject);
    } catch (error) {
      console.error("Error updating subject:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete(
  "/api/subjects/:id",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const subject = await Subject.findByIdAndDelete(req.params.id);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.json({ message: "Subject deleted" });
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Specialization Endpoints
app.get("/api/specializations/:year", authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    if (!["third", "fourth"].includes(year)) {
      return res.status(400).json({ error: "Invalid year" });
    }
    const specializations = await Specialization.find({ year });
    const subjects = await Subject.find({
      year: "specialization",
      specializationId: { $in: specializations.map((s) => s._id) },
    });

    const result = specializations.map((spec) => ({
      ...spec.toObject(),
      subjects: subjects.filter(
        (sub) => sub.specializationId.toString() === spec._id.toString()
      ),
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post(
  "/api/specializations",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const { name, code, description, icon, color, year } = req.body;

      if (!["third", "fourth"].includes(year)) {
        return res.status(400).json({ error: "Invalid year" });
      }

      const specialization = new Specialization({
        name,
        code,
        description,
        icon,
        color,
        year,
      });

      await specialization.save();
      res.status(201).json(specialization);
    } catch (error) {
      console.error("Error creating specialization:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.put(
  "/api/specializations/:id",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const { name, code, description, icon, color, year } = req.body;

      if (!["third", "fourth"].includes(year)) {
        return res.status(400).json({ error: "Invalid year" });
      }

      const specialization = await Specialization.findByIdAndUpdate(
        req.params.id,
        { name, code, description, icon, color, year },
        { new: true, runValidators: true }
      );

      if (!specialization) {
        return res.status(404).json({ error: "Specialization not found" });
      }

      res.json(specialization);
    } catch (error) {
      console.error("Error updating specialization:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete(
  "/api/specializations/:id",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const specialization = await Specialization.findByIdAndDelete(
        req.params.id
      );
      if (!specialization) {
        return res.status(404).json({ error: "Specialization not found" });
      }

      await Subject.deleteMany({ specializationId: req.params.id });
      res.json({ message: "Specialization and associated subjects deleted" });
    } catch (error) {
      console.error("Error deleting specialization:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Use routes
app.use("/api/study-groups", studyGroupRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
