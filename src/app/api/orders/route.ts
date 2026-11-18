import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import prisma from "@/lib/prisma";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(25),
  }),

  shippingAddress: z.object({
    addressLine1: z.string().trim().min(3).max(200),
    addressLine2: z.string().trim().max(200).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().min(3).max(15),
    country: z.string().trim().min(2).max(100).default("India"),
  }),

  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Invalid product ID."),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),

  paymentMethod: z.enum(["cod", "online"]),
  customerNotes: z.string().trim().max(1000).optional().default(""),
  couponCode: z.string().trim().max(32).optional().default(""),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

function roundMoney(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function makeOrderNumber() {
  return `BIAX-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Please submit valid checkout details." },
        { status: 400 },
      );
    }

    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            validation.error.issues[0]?.message ??
            "Please check your checkout details.",
        },
        { status: 400 },
      );
    }

    const data: CheckoutData = validation.data;

    // Combine duplicate products into one line.
    const quantities = new Map<string, number>();

    for (const item of data.items) {
      const id = item.productId;
      const quantity = (quantities.get(id) ?? 0) + item.quantity;

      if (quantity > 50) {
        return NextResponse.json(
          { message: "The quantity of a product cannot exceed 50." },
          { status: 400 },
        );
      }

      quantities.set(id, quantity);
    }

    const productIds = Array.from(quantities.keys());

    // Execute atomic transaction on TiDB
    const createdOrder = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          published: true,
        },
      });

      const productMap = new Map(products.map((product) => [product.id, product]));

      const orderItems: Array<{
        productId: string;
        name: string;
        slug: string;
        image: string;
        price: number;
        quantity: number;
        lineTotal: number;
      }> = [];

      let subtotal = 0;

      for (const [productId, quantity] of quantities) {
        const product = productMap.get(productId);

        if (!product) {
          throw new Error("PRODUCT_UNAVAILABLE");
        }

        if (product.isComingSoon) {
          throw new Error("PRODUCT_COMING_SOON");
        }

        if (product.stock < quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const price = roundMoney(Number(product.price));
        const lineTotal = roundMoney(price * quantity);
        subtotal = roundMoney(subtotal + lineTotal);

        const images = Array.isArray(product.images) ? (product.images as string[]) : [];

        orderItems.push({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: images[0] ?? "",
          price,
          quantity,
          lineTotal,
        });
      }

      // Decrement stock
      for (const [productId, quantity] of quantities) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: productId,
            published: true,
            stock: { gte: quantity },
          },
          data: {
            stock: { decrement: quantity },
          },
        });

        if (updateResult.count === 0) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      // Coupon application
      let discountAmount = 0;
      let appliedCouponCode = "";

      if (data.couponCode && data.couponCode.trim()) {
        const candidateCode = data.couponCode.trim().toUpperCase();
        const coupon = await tx.coupon.findFirst({
          where: {
            code: candidateCode,
            active: true,
          },
        });

        if (coupon) {
          const now = new Date();
          const isDateValid =
            (!coupon.startDate || coupon.startDate <= now) &&
            (!coupon.endDate || coupon.endDate >= now);
          const isUsageValid =
            !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
          const isMinOrderValid =
            !coupon.minOrderValue || subtotal >= coupon.minOrderValue;

          if (isDateValid && isUsageValid && isMinOrderValid) {
            appliedCouponCode = coupon.code;
            if (coupon.discountType === "percentage") {
              const rawDiscount = Math.round((subtotal * coupon.discountValue) / 100);
              discountAmount = coupon.maxDiscountAmount
                ? Math.min(rawDiscount, coupon.maxDiscountAmount)
                : rawDiscount;
            } else {
              discountAmount = Math.min(subtotal, Math.round(coupon.discountValue));
            }

            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      const shippingCharge = 0;
      const total = Math.max(0, roundMoney(subtotal - discountAmount + shippingCharge));
      const orderNumber = makeOrderNumber();

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customer.name,
          customerEmail: data.customer.email,
          customerPhone: data.customer.phone,
          addressLine1: data.shippingAddress.addressLine1,
          addressLine2: data.shippingAddress.addressLine2,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          postalCode: data.shippingAddress.postalCode,
          country: data.shippingAddress.country,
          subtotal,
          shippingCharge,
          couponCode: appliedCouponCode,
          discountAmount,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: "pending",
          orderStatus: "pending",
          customerNotes: data.customerNotes,
          items: {
            create: orderItems,
          },
        },
      });

      return {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod as "cod" | "online",
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      };
    });

    return NextResponse.json(
      {
        message:
          createdOrder.paymentMethod === "cod"
            ? "Your order has been placed successfully."
            : "Your order has been created. Complete online payment to confirm payment.",
        order: createdOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_COMING_SOON") {
      return NextResponse.json(
        {
          message:
            "One or more products in your cart are Coming Soon and cannot be purchased yet.",
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "PRODUCT_UNAVAILABLE") {
      return NextResponse.json(
        {
          message:
            "One or more products are unavailable. Please refresh your cart.",
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        {
          message:
            "A product no longer has enough stock. Please update your cart.",
        },
        { status: 409 },
      );
    }

    console.error("Checkout order creation error:", error);

    return NextResponse.json(
      {
        message: "We couldn't place your order right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
