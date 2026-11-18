import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const search = request.nextUrl.searchParams
      .get("search")
      ?.trim()
      .toLowerCase()
      .slice(0, 100);

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<string, any>();

    for (const order of orders) {
      const key = (order.customerEmail || order.customerPhone || order.id).toLowerCase();

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          latestAddress: {
            addressLine1: order.addressLine1,
            addressLine2: order.addressLine2 || "",
            city: order.city,
            state: order.state,
            postalCode: order.postalCode,
            country: order.country,
          },
          orderCount: 0,
          totalOrderValue: 0,
          lastOrderAt: order.createdAt,
          latestOrderNumber: order.orderNumber,
        });
      }

      const record = customerMap.get(key);
      record.orderCount += 1;
      if (order.orderStatus !== "cancelled") {
        record.totalOrderValue += Number(order.total) || 0;
      }
    }

    let customers = Array.from(customerMap.values());

    if (search) {
      customers = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search),
      );
    }

    return NextResponse.json({
      customers: customers.slice(0, 500),
      total: customers.length,
    });
  } catch (error) {
    console.error("Admin customers GET error:", error);

    return NextResponse.json(
      { message: "Unable to load customers. Please try again." },
      { status: 500 },
    );
  }
}
