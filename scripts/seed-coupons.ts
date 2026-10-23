import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.local" });

async function seedCoupons() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env.local");
    }

    const { connectToDatabase } = await import("../src/lib/mongodb");
    const { default: Coupon } = await import("../src/models/Coupon");

    await connectToDatabase();

    const starterCoupons = [
      {
        code: "BIAX10",
        description: "10% off on all sportswear and martial arts gear",
        discountType: "percentage" as const,
        discountValue: 10,
        minOrderValue: 0,
        active: true,
      },
      {
        code: "IMPACT20",
        description: "20% off on orders above ₹1,999 (Max ₹500 off)",
        discountType: "percentage" as const,
        discountValue: 20,
        minOrderValue: 1999,
        maxDiscountAmount: 500,
        active: true,
      },
      {
        code: "WELCOME500",
        description: "Flat ₹500 discount for new athletes on orders above ₹2,499",
        discountType: "flat" as const,
        discountValue: 500,
        minOrderValue: 2499,
        active: true,
      },
    ];

    for (const c of starterCoupons) {
      const exists = await Coupon.findOne({ code: c.code });
      if (!exists) {
        await Coupon.create(c);
        console.log(`Created starter coupon: ${c.code}`);
      } else {
        console.log(`Coupon already exists: ${c.code}`);
      }
    }

    console.log("Coupons setup complete.");
  } catch (err) {
    console.error("Coupon seeding failed:", err);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

void seedCoupons();
