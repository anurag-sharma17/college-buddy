/**
 * migrateDB.js
 * ─────────────────────────────────────────────────────────
 * Database migration / seed script for College Buddy.
 *
 * Reads seed-data.json and populates the target MongoDB
 * with all the required collections. Skips the "users"
 * collection so that each environment starts fresh with
 * no user accounts.
 *
 * Usage:
 *   node backend/scripts/migrateDB.js                  # default: uses seed-data.json
 *   node backend/scripts/migrateDB.js path/to/data.json # custom seed file
 *
 * Options (via env vars):
 *   DROP_EXISTING=true   Drops existing collections before importing (default: false)
 *   MONGO_URI=<uri>      Override the .env MongoDB URI
 * ─────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Collections that should never be imported (safety net)
const SKIP_COLLECTIONS = ["users", "_meta"];

async function migrateDB() {
  try {
    // Determine seed file path
    const seedFilePath = process.argv[2]
      ? path.resolve(process.argv[2])
      : path.join(__dirname, "seed-data.json");

    if (!fs.existsSync(seedFilePath)) {
      console.error(`❌ Seed file not found: ${seedFilePath}`);
      console.error(
        "\n   Run the export script first:\n   node backend/scripts/exportData.js\n"
      );
      process.exit(1);
    }

    console.log(`📂 Reading seed file: ${seedFilePath}`);
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));

    if (seedData._meta) {
      console.log(`ℹ️  Seed exported at: ${seedData._meta.exportedAt}`);
    }

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    console.log(`🔗 Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const dropExisting = process.env.DROP_EXISTING === "true";
    const collectionNames = Object.keys(seedData).filter(
      (name) => !SKIP_COLLECTIONS.includes(name)
    );

    console.log(
      `\n📋 Collections to migrate: ${collectionNames.join(", ")}\n`
    );

    let totalInserted = 0;

    for (const collName of collectionNames) {
      const docs = seedData[collName];

      if (!Array.isArray(docs) || docs.length === 0) {
        console.log(`⏭️  Skipping "${collName}" (empty or invalid)`);
        continue;
      }

      // Check if collection already has data
      const existingCount = await db
        .collection(collName)
        .countDocuments();

      if (existingCount > 0 && !dropExisting) {
        console.log(
          `⚠️  "${collName}" already has ${existingCount} documents. Skipping. ` +
            `Set DROP_EXISTING=true to overwrite.`
        );
        continue;
      }

      if (existingCount > 0 && dropExisting) {
        await db.collection(collName).drop();
        console.log(`🗑️  Dropped existing "${collName}" collection`);
      }

      // Insert seed data
      await db.collection(collName).insertMany(docs);
      totalInserted += docs.length;
      console.log(`✅ Inserted ${docs.length} documents into "${collName}"`);
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   Total documents inserted: ${totalInserted}`);
    console.log(`   Collections processed: ${collectionNames.length}`);
    console.log(`   Users collection: ❌ Excluded (as intended)\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateDB();
