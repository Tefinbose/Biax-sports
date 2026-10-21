
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";

const updateOrderSchema = z.object({
  orderId: z.string().refine(
    (value) => mongoose.isValidObjectId(value),
    "Invalid order ID.",
  ),
  orderStatus: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in as an admin." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") ?? "").trim().slice(0, 100);
    const status = searchParams.get("status") ?? "all";

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (status !== "all" && !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid order status filter." },
        { status: 400 },
      );
    }

    const filter: Record<string, unknown> = {};

    if (status !== "all") {
      filter.orderStatus = status;
    }

    if (search) {
      const safeSearch = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { orderNumber: safeSearch },
        { "customer.name": safeSearch },
        { "customer.email": safeSearch },
        { "customer.phone": safeSearch },
      ];
    }

    const orders = await Order.find(filter)
      .select(
        "orderNumber customer shippingAddress items subtotal shippingCharge total paymentMethod paymentStatus orderStatus createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json({
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      { message: "Unable to load orders right now." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in as an admin." },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Please submit valid order details." },
        { status: 400 },
      );
    }

    const validation = updateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            validation.error.issues[0]?.message ??
            "Invalid order update.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const currentOrder = await Order.findById(validation.data.orderId);

    if (!currentOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    // If order is transitioning to cancelled, restore the inventory
    if (
      validation.data.orderStatus === "cancelled" &&
      currentOrder.orderStatus !== "cancelled"
    ) {
      for (const item of currentOrder.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    currentOrder.orderStatus = validation.data.orderStatus;
    await currentOrder.save();

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: currentOrder,
    });
  } catch (error) {
    console.error("Admin orders PUT error:", error);

    return NextResponse.json(
      { message: "Unable to update the order right now." },
      { status: 500 },
    );
  }
}
