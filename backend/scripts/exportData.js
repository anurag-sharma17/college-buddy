/**
 * exportData.js
 * ─────────────────────────────────────────────────────────
 * Connects to the existing MongoDB instance and exports all
 * collection data (except "users") to a single JSON seed file.
 *
 * Usage:
 *   node backend/scripts/exportData.js
 *
 * Output:
 *   backend/scripts/seed-data.json
 * ─────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Collections to skip during export
const SKIP_COLLECTIONS = ["users"];

async function exportData() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    // Get all collections in the database
    const collections = await db.listCollections().toArray();
    const exportPayload = {
      _meta: {
        exportedAt: new Date().toISOString(),
        mongoUri: process.env.MONGO_URI.replace(/\/\/.*@/, "//***@"), // redact credentials
        note: "Users collection is excluded from this export.",
      },
    };

    for (const collInfo of collections) {
      const collName = collInfo.name;

      // Skip system collections and excluded collections
      if (collName.startsWith("system.") || SKIP_COLLECTIONS.includes(collName)) {
        console.log(`⏭️  Skipping collection: ${collName}`);
        continue;
      }

      const docs = await db.collection(collName).find({}).toArray();
      exportPayload[collName] = docs;
      console.log(`📦 Exported ${docs.length} documents from "${collName}"`);
    }

    // Write to seed file
    const outputPath = path.join(__dirname, "seed-data.json");
    fs.writeFileSync(outputPath, JSON.stringify(exportPayload, null, 2), "utf-8");

    console.log(`\n🎉 Export complete! Seed file saved to:\n   ${outputPath}`);
    console.log(`   Total collections exported: ${Object.keys(exportPayload).length - 1}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  }
}

exportData();
