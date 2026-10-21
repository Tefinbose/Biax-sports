import { NextResponse } from "next/server";
import {z} from "zod";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import {
  createAdminSession,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(1024),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Enter a valid email address and password." },
        { status: 400 },
      );
    }

    const email = result.data.email.toLowerCase();
    const { password } = result.data;

    await connectToDatabase();

    const admin = await Admin.findOne({
      email,
      active: true,
      role: "admin",
    }).select("+passwordHash");

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createAdminSession(
      admin._id.toString(),
      admin.email,
    );

    const response = NextResponse.json({
      message: "Login successful.",
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "Unable to log in right now. Please try again." },
      { status: 500 },
    );
  }
}