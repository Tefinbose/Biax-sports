import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { formatOrder } from "@/lib/db-helpers";

const updateOrderSchema = z.object({
  orderId: z.string().min(1, "Invalid order ID."),
  orderStatus: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function GET(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in as an admin." },
        { status: 401 },
      );
    }

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

    const where: any = {};

    if (status !== "all") {
      where.orderStatus = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const formattedOrders = orders.map(formatOrder);

    return NextResponse.json({
      orders: formattedOrders,
      count: formattedOrders.length,
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

    const currentOrder = await prisma.order.findUnique({
      where: { id: validation.data.orderId },
      include: { items: true },
    });

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
          await prisma.product.updateMany({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    const updated = await prisma.order.update({
      where: { id: currentOrder.id },
      data: { orderStatus: validation.data.orderStatus },
      include: { items: true },
    });

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: formatOrder(updated),
    });
  } catch (error) {
    console.error("Admin orders PUT error:", error);

    return NextResponse.json(
      { message: "Unable to update the order right now." },
      { status: 500 },
    );
  }
}
