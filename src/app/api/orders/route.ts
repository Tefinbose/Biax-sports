
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { randomBytes } from "node:crypto";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

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
        productId: z.string().refine(
          (value) => mongoose.isValidObjectId(value),
          "Invalid product ID.",
        ),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),

  paymentMethod: z.enum(["cod", "online"]),
  customerNotes: z.string().trim().max(1000).optional().default(""),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

function roundMoney(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function makeOrderNumber() {
  return `BIAX-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  let session: mongoose.ClientSession | undefined;

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

    await connectToDatabase();

    // A MongoDB transaction keeps stock changes and order creation together.
    session = await mongoose.startSession();

    let createdOrder:
      | {
          orderNumber: string;
          total: number;
          paymentMethod: "cod" | "online";
          paymentStatus: string;
          orderStatus: string;
        }
      | undefined;

    await session.withTransaction(async () => {
      const productIds = Array.from(quantities.keys());

      const products = await Product.find({
        _id: { $in: productIds },
        published: true,
      })
        .session(session!)
        .lean();

      const productMap = new Map(
        products.map((product) => [
          String(product._id),
          product,
        ]),
      );

      const orderItems: Array<{
        productId: mongoose.Types.ObjectId;
        name: string;
        slug: string;
        image: string;
        price: number;
        quantity: number;
        lineTotal: number;
      }> = [];

      let subtotal = 0;

      // Recalculate prices and verify availability using database data.
      for (const [productId, quantity] of quantities) {
        const product = productMap.get(productId);

        if (!product) {
          throw new Error("PRODUCT_UNAVAILABLE");
        }

        if (product.stock < quantity) {
          throw new Error("INSUFFICIENT_STOCK");
        }

        const price = roundMoney(Number(product.price));
        const lineTotal = roundMoney(price * quantity);

        subtotal = roundMoney(subtotal + lineTotal);

        orderItems.push({
          productId: new mongoose.Types.ObjectId(productId),
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] ?? "",
          price,
          quantity,
          lineTotal,
        });
      }

      // Reserve stock atomically. If any update fails, the transaction rolls back.
      for (const [productId, quantity] of quantities) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            published: true,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          {
            new: true,
            session: session!,
          },
        );

        if (!updatedProduct) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      // Shipping is temporarily free. Configure actual delivery charges later.
      const shippingCharge = 0;
      const total = roundMoney(subtotal + shippingCharge);
      const orderNumber = makeOrderNumber();

      const [order] = await Order.create(
        [
          {
            orderNumber,
            customer: data.customer,
            shippingAddress: data.shippingAddress,
            items: orderItems,
            subtotal,
            shippingCharge,
            total,
            paymentMethod: data.paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
            customerNotes: data.customerNotes,
          },
        ],
        { session: session! },
      );

      createdOrder = {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      };
    });

    if (!createdOrder) {
      throw new Error("ORDER_CREATION_FAILED");
    }

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
    if (
      error instanceof Error &&
      error.message === "PRODUCT_UNAVAILABLE"
    ) {
      return NextResponse.json(
        {
          message:
            "One or more products are unavailable. Please refresh your cart.",
        },
        { status: 400 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "INSUFFICIENT_STOCK"
    ) {
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
        message:
          "We couldn't place your order right now. Please try again.",
      },
      { status: 500 },
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
