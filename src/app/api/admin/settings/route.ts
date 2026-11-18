import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    let settings = await prisma.storeSettings.findFirst();

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: defaultSettings,
      });
    }

    return NextResponse.json({
      settings: {
        ...settings,
        _id: settings.id,
      },
    });
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

    let existing = await prisma.storeSettings.findFirst();
    let settings;

    if (existing) {
      settings = await prisma.storeSettings.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      settings = await prisma.storeSettings.create({
        data: parsed.data,
      });
    }

    return NextResponse.json({
      message: "Store settings saved successfully.",
      settings: {
        ...settings,
        _id: settings.id,
      },
    });
  } catch (error) {
    console.error("Admin settings PUT error:", error);

    return NextResponse.json(
      { message: "Unable to save store settings." },
      { status: 500 }
    );
  }
}
