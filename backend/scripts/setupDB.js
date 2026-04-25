/**
 * setupDB.js
 * ─────────────────────────────────────────────────────────
 * Initializes the MongoDB database with all collection
 * schemas and indexes used by College Buddy.
 *
 * This script:
 *  1. Connects to MongoDB
 *  2. Registers every Mongoose schema (User, Teacher, etc.)
 *  3. Creates the collections and syncs indexes
 *  4. Optionally seeds data from seed-data.json
 *
 * Usage:
 *   node backend/scripts/setupDB.js              # schema + indexes only
 *   node backend/scripts/setupDB.js --seed        # schema + indexes + seed data
 *   node backend/scripts/setupDB.js --seed --fresh # drop all, then schema + seed
 * ─────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// ─── CLI flags ───────────────────────────────────────────
const args = process.argv.slice(2);
const SEED = args.includes("--seed");
const FRESH = args.includes("--fresh");

// ═════════════════════════════════════════════════════════
//  SCHEMA DEFINITIONS  (mirrors server.js exactly)
// ═════════════════════════════════════════════════════════

// ── User ─────────────────────────────────────────────────
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

// ── Teacher ──────────────────────────────────────────────
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

// ── Seating ──────────────────────────────────────────────
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

// ── Club ─────────────────────────────────────────────────
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  events: [{ title: String, date: Date, description: String }],
  createdAt: { type: Date, default: Date.now },
});

// ── Resource ─────────────────────────────────────────────
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

// ── StudyGroup ───────────────────────────────────────────
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

// ── Alumni ───────────────────────────────────────────────
const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  graduationYear: { type: Number },
  profession: { type: String },
  company: { type: String },
  linkedIn: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ── Subject ──────────────────────────────────────────────
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

// ── Specialization ───────────────────────────────────────
const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  year: { type: String, enum: ["third", "fourth"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// ── Contact ──────────────────────────────────────────────
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
  name: { type: String, required: true, trim: true },
  designation: { type: String, trim: true },
  department: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  officeLocation: { type: String, trim: true },
  officeHours: { type: String, trim: true },
  website: { type: String, trim: true },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  description: { type: String },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

contactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// ── Route (Transport) ────────────────────────────────────
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

// ── Map ──────────────────────────────────────────────────
const mapSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ═════════════════════════════════════════════════════════
//  REGISTER ALL MODELS
// ═════════════════════════════════════════════════════════

const models = {
  User: mongoose.model("User", userSchema),
  Teacher: mongoose.model("Teacher", teacherSchema),
  Seating: mongoose.model("Seating", seatingSchema),
  Club: mongoose.model("Club", clubSchema),
  Resource: mongoose.model("Resource", resourceSchema),
  StudyGroup: mongoose.model("StudyGroup", studyGroupSchema),
  Alumni: mongoose.model("Alumni", alumniSchema),
  Subject: mongoose.model("Subject", subjectSchema),
  Specialization: mongoose.model("Specialization", specializationSchema),
  Contact: mongoose.model("Contact", contactSchema),
  Route: mongoose.model("Route", routeSchema),
  Map: mongoose.model("Map", mapSchema),
};

// Map Mongoose model names to their actual MongoDB collection names
const modelToCollection = {};
for (const [name, model] of Object.entries(models)) {
  modelToCollection[name] = model.collection.collectionName;
}

// ═════════════════════════════════════════════════════════
//  MAIN SETUP FUNCTION
// ═════════════════════════════════════════════════════════

async function setupDB() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;

    // ── Step 0: Fresh mode — drop everything ─────────────
    if (FRESH) {
      console.log("🗑️  FRESH mode: Dropping all existing collections...");
      const existing = await db.listCollections().toArray();
      for (const coll of existing) {
        if (!coll.name.startsWith("system.")) {
          await db.dropCollection(coll.name);
          console.log(`   Dropped: ${coll.name}`);
        }
      }
      console.log("");
    }

    // ── Step 1: Create collections & sync indexes ────────
    console.log("📐 Creating collections and syncing indexes...\n");

    for (const [name, model] of Object.entries(models)) {
      try {
        await model.createCollection();
        await model.syncIndexes();
        const indexes = await model.collection.indexes();
        const indexNames = indexes
          .map((i) => i.name)
          .filter((n) => n !== "_id_");
        console.log(
          `   ✅ ${name.padEnd(16)} → collection: "${model.collection.collectionName}"` +
            (indexNames.length > 0
              ? ` | indexes: [${indexNames.join(", ")}]`
              : "")
        );
      } catch (err) {
        // Collection may already exist, that's fine
        if (err.codeName === "NamespaceExists") {
          await model.syncIndexes();
          console.log(
            `   ✅ ${name.padEnd(16)} → collection: "${model.collection.collectionName}" (already existed, indexes synced)`
          );
        } else {
          throw err;
        }
      }
    }

    // ── Step 2: Seed data (optional) ─────────────────────
    if (SEED) {
      console.log("\n📦 Seeding data from seed-data.json...\n");

      const seedFilePath = path.join(__dirname, "seed-data.json");
      if (!fs.existsSync(seedFilePath)) {
        console.error(
          `   ❌ seed-data.json not found! Run export first:\n` +
            `      node backend/scripts/exportData.js\n`
        );
      } else {
        const seedData = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));
        let totalInserted = 0;

        // Skip _meta and users
        const skipKeys = ["_meta", "users"];

        for (const [collName, docs] of Object.entries(seedData)) {
          if (skipKeys.includes(collName)) continue;
          if (!Array.isArray(docs) || docs.length === 0) continue;

          const existingCount = await db
            .collection(collName)
            .countDocuments();

          if (existingCount > 0 && !FRESH) {
            console.log(
              `   ⚠️  "${collName}" has ${existingCount} docs, skipping (use --fresh to overwrite)`
            );
            continue;
          }

          await db.collection(collName).insertMany(docs);
          totalInserted += docs.length;
          console.log(
            `   ✅ Seeded ${String(docs.length).padStart(3)} documents → "${collName}"`
          );
        }

        console.log(`\n   Total documents seeded: ${totalInserted}`);
      }
    }

    // ── Summary ──────────────────────────────────────────
    console.log("\n" + "═".repeat(55));
    console.log("  🎉 Database setup complete!");
    console.log("═".repeat(55));
    console.log("\n  Collections created:\n");
    for (const [name, collName] of Object.entries(modelToCollection)) {
      const count = await db.collection(collName).countDocuments();
      const icon = name === "User" ? "👤" : "📁";
      console.log(
        `   ${icon} ${name.padEnd(16)} → ${collName.padEnd(20)} (${count} documents)`
      );
    }
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupDB();
