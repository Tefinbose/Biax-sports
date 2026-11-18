import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const coupon = await prisma.coupon.findFirst({
      where: { code, active: true },
    });

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
          message: `This coupon requires a minimum subtotal of ₹${coupon.minOrderValue.toLocaleString("en-IN")}.`,
        },
        { status: 400 },
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (
        typeof coupon.maxDiscountAmount === "number" &&
        coupon.maxDiscountAmount > 0
      ) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        _id: coupon.id,
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minOrderValue: coupon.minOrderValue,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Unable to validate coupon." },
      { status: 500 },
    );
  }
}
