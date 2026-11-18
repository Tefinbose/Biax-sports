import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function seedCoupons() {
  try {
    const starterCoupons = [
      {
        code: "BIAX10",
        description: "10% off on all sportswear and martial arts gear",
        discountType: "percentage",
        discountValue: 10,
        minOrderValue: 0,
        active: true,
      },
      {
        code: "IMPACT20",
        description: "20% off on orders above ₹1,999 (Max ₹500 off)",
        discountType: "percentage",
        discountValue: 20,
        minOrderValue: 1999,
        maxDiscountAmount: 500,
        active: true,
      },
      {
        code: "WELCOME500",
        description: "Flat ₹500 discount for new athletes on orders above ₹2,499",
        discountType: "flat",
        discountValue: 500,
        minOrderValue: 2499,
        active: true,
      },
    ];

    for (const c of starterCoupons) {
      const exists = await prisma.coupon.findUnique({ where: { code: c.code } });
      if (!exists) {
        await prisma.coupon.create({ data: c });
        console.log(`Created starter coupon in TiDB: ${c.code}`);
      } else {
        console.log(`Coupon already exists in TiDB: ${c.code}`);
      }
    }

    console.log("Coupons setup complete.");
  } catch (err) {
    console.error("Coupon seeding failed:", err);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

void seedCoupons();
