import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "BIAX Administrator";

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

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingAdmin) {
      throw new Error(
        `An admin account already exists for ${email}. No changes were made.`,
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: "admin",
        active: true,
      },
    });

    console.log(`Admin account created successfully in TiDB for ${email}.`);
    console.log("Remove ADMIN_PASSWORD from .env.local after setup.");
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

void createAdmin();
