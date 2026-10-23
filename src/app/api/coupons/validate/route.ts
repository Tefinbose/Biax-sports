import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Enter a coupon code to apply." },
        { status: 400 },
      );
    }

    const code = body.code.trim().toUpperCase();
    const subtotal = Math.max(0, Number(body.subtotal) || 0);

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Coupon code cannot be empty." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const coupon = await Coupon.findOne({ code, active: true }).lean();

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Invalid or inactive coupon code." },
        { status: 404 },
      );
    }

    const now = new Date();

    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return NextResponse.json(
        { valid: false, message: "This coupon is not active yet." },
        { status: 400 },
      );
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return NextResponse.json(
        { valid: false, message: "This coupon has expired." },
        { status: 400 },
      );
    }

    if (
      typeof coupon.usageLimit === "number" &&
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return NextResponse.json(
        {
          valid: false,
          message: "This coupon has reached its maximum redemption limit.",
        },
        { status: 400 },
      );
    }

    if (coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required for this coupon.`,
        },
        { status: 400 },
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      const calculated = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(calculated, coupon.maxDiscountAmount);
      } else {
        discountAmount = calculated;
      }
    } else {
      // Flat amount discount
      discountAmount = Math.min(subtotal, Math.round(coupon.discountValue));
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
        minOrderValue: coupon.minOrderValue,
      },
      message: `Coupon '${coupon.code}' applied! You save ₹${discountAmount.toLocaleString("en-IN")}.`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Unable to validate coupon right now." },
      { status: 500 },
    );
  }
}
