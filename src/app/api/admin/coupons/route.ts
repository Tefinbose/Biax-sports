import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Coupon from "@/models/Coupon";

const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters")
    .max(32, "Code cannot exceed 32 characters")
    .transform((v) => v.toUpperCase()),
  description: z.string().trim().max(200).optional().default(""),
  discountType: z.enum(["percentage", "flat"]),
  discountValue: z.number().min(1, "Discount value must be at least 1"),
  minOrderValue: z.number().min(0).default(0),
  maxDiscountAmount: z.number().min(0).nullable().optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Admin coupons GET error:", error);
    return NextResponse.json(
      { message: "Unable to load coupons." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = couponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid coupon details." },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.discountType === "percentage" && data.discountValue > 100) {
      return NextResponse.json(
        { message: "Percentage discount cannot exceed 100%." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await Coupon.findOne({ code: data.code }).select("_id");
    if (existing) {
      return NextResponse.json(
        { message: `Coupon '${data.code}' already exists.` },
        { status: 409 },
      );
    }

    const [coupon] = await Coupon.create([
      {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        maxDiscountAmount: data.maxDiscountAmount ?? null,
        usageLimit: data.usageLimit ?? null,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        active: data.active,
      },
    ]);

    return NextResponse.json(
      { message: `Coupon '${coupon.code}' created successfully.`, coupon },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin coupons POST error:", error);
    return NextResponse.json(
      { message: "Unable to create coupon." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { message: "Coupon ID is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await Coupon.findById(body.id);
    if (!existing) {
      return NextResponse.json(
        { message: "Coupon not found." },
        { status: 404 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.code && typeof body.code === "string") {
      const formattedCode = body.code.trim().toUpperCase();
      if (formattedCode !== existing.code) {
        const duplicate = await Coupon.findOne({
          code: formattedCode,
          _id: { $ne: body.id },
        }).select("_id");
        if (duplicate) {
          return NextResponse.json(
            { message: `A coupon with code '${formattedCode}' already exists.` },
            { status: 409 },
          );
        }
        updateData.code = formattedCode;
      }
    }

    if (typeof body.active === "boolean") {
      updateData.active = body.active;
    }
    if (typeof body.description === "string") {
      updateData.description = body.description.trim();
    }
    if (body.discountType === "percentage" || body.discountType === "flat") {
      updateData.discountType = body.discountType;
    }
    if (body.discountValue !== undefined) {
      const val = Number(body.discountValue);
      if (isNaN(val) || val <= 0) {
        return NextResponse.json(
          { message: "Discount value must be greater than 0." },
          { status: 400 },
        );
      }
      const type = (updateData.discountType || existing.discountType) as string;
      if (type === "percentage" && val > 100) {
        return NextResponse.json(
          { message: "Percentage discount cannot exceed 100%." },
          { status: 400 },
        );
      }
      updateData.discountValue = val;
    }
    if (body.maxDiscountAmount !== undefined) {
      updateData.maxDiscountAmount =
        body.maxDiscountAmount && Number(body.maxDiscountAmount) > 0
          ? Number(body.maxDiscountAmount)
          : null;
    }
    if (body.usageLimit !== undefined) {
      updateData.usageLimit =
        body.usageLimit && Number(body.usageLimit) > 0
          ? Number(body.usageLimit)
          : null;
    }
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    }
    if (body.minOrderValue !== undefined) {
      updateData.minOrderValue = Math.max(0, Number(body.minOrderValue) || 0);
    }

    const coupon = await Coupon.findByIdAndUpdate(body.id, updateData, {
      new: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `Coupon '${coupon.code}' updated successfully.`,
      coupon,
    });
  } catch (error) {
    console.error("Admin coupons PUT error:", error);
    return NextResponse.json(
      { message: "Unable to update coupon." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Valid Coupon ID is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Coupon not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `Coupon '${deleted.code}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Admin coupons DELETE error:", error);
    return NextResponse.json(
      { message: "Unable to delete coupon." },
      { status: 500 },
    );
  }
}
