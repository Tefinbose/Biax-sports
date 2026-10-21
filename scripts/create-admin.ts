
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "BIAX Administrator";

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env.local.");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Set a valid ADMIN_EMAIL in .env.local.");
    }

    if (!password || password.length < 12) {
      throw new Error(
        "Set ADMIN_PASSWORD to a password with at least 12 characters.",
      );
    }

    if (password.length > 72) {
      throw new Error("ADMIN_PASSWORD must not exceed 72 characters.");
    }

    // Import only after dotenv has loaded the MongoDB URI.
    const { connectToDatabase } = await import("../src/lib/mongodb");
    const { default: Admin } = await import("../src/models/Admin");

    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ email }).select("_id");

    if (existingAdmin) {
      throw new Error(
        `An admin account already exists for ${email}. No changes were made.`,
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.create({
      name,
      email,
      passwordHash,
      role: "admin",
      active: true,
    });

    console.log(`Admin account created successfully for ${email}.`);
    console.log("Remove ADMIN_PASSWORD from .env.local after setup.");
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

void createAdmin();
