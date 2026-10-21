
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import StoreSettings from "@/models/StoreSettings";

const settingsSchema = z.object({
  storeName: z.string().trim().min(1).max(100),
  tagline: z.string().trim().max(200),
  contactEmail: z.string().trim().email().max(254),
  phone: z.string().trim().max(30),
  address: z.string().trim().max(500),
  shippingCharge: z.number().finite().min(0).max(100000),
  freeShippingThreshold: z.number().finite().min(0).max(10000000),
  codEnabled: z.boolean(),
});

const defaultSettings = {
  storeName: "BIAX SPORTS",
  tagline: "Empowering Athletes. Elevating Performance.",
  contactEmail: "info@biaxsports.com",
  phone: "",
  address: "",
  shippingCharge: 0,
  freeShippingThreshold: 0,
  codEnabled: true,
};

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    let settings = await StoreSettings.findOne().lean();

    if (!settings) {
      settings = await StoreSettings.create(defaultSettings);
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Admin settings GET error:", error);

    return NextResponse.json(
      { message: "Unable to load store settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid settings. Please check your entries.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const settings = await StoreSettings.findOneAndUpdate(
      {},
      { $set: parsed.data, $setOnInsert: {} },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      message: "Store settings saved successfully.",
      settings,
    });
  } catch (error) {
    console.error("Admin settings PUT error:", error);

    return NextResponse.json(
      { message: "Unable to save store settings." },
      { status: 500 }
    );
  }
}
