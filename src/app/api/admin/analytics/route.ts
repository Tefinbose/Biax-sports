import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "7d";
    const daysCount = rangeParam === "90d" ? 90 : rangeParam === "30d" ? 30 : 7;

    const now = new Date();
    const startDate = new Date(now);
    startDate.setUTCDate(startDate.getUTCDate() - (daysCount - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    const [orders, pendingCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startDate, lte: now },
        },
        include: {
          items: true,
        },
      }),
      prisma.order.count({
        where: {
          orderStatus: { in: ["pending", "processing"] },
        },
      }),
    ]);

    let totalOrders = 0;
    let cancelledOrders = 0;
    let paidOrders = 0;
    let paidRevenue = 0;
    let totalDiscount = 0;
    let ordersWithCoupon = 0;

    const customersSet = new Set<string>();
    const salesByDate = new Map<string, { revenue: number; orders: number }>();
    const popularProductsMap = new Map<string, { name: string; slug: string; image: string; quantitySold: number; salesValue: number }>();
    const paymentMethodsMap = new Map<string, { count: number; revenue: number }>();
    const orderStatusesMap = new Map<string, { count: number; revenue: number }>();
    const stateMap = new Map<string, { orders: number; revenue: number }>();

    for (const order of orders) {
      totalOrders++;
      const isCancelled = order.orderStatus === "cancelled";
      const isPaid = order.paymentStatus === "paid";
      const orderTotal = Number(order.total) || 0;
      const discount = Number(order.discountAmount) || 0;

      if (isCancelled) {
        cancelledOrders++;
      } else {
        if (discount > 0) {
          totalDiscount += discount;
          ordersWithCoupon++;
        }

        // payment methods
        const pm = (order.paymentMethod || "cod").toLowerCase();
        const curPm = paymentMethodsMap.get(pm) || { count: 0, revenue: 0 };
        curPm.count++;
        curPm.revenue += orderTotal;
        paymentMethodsMap.set(pm, curPm);

        // state
        const st = order.state?.trim();
        if (st) {
          const curSt = stateMap.get(st) || { orders: 0, revenue: 0 };
          curSt.orders++;
          curSt.revenue += orderTotal;
          stateMap.set(st, curSt);
        }

        // items
        for (const item of order.items) {
          const key = item.productId || item.name;
          const curItem = popularProductsMap.get(key) || {
            name: item.name,
            slug: item.slug,
            image: item.image || "",
            quantitySold: 0,
            salesValue: 0,
          };
          curItem.quantitySold += item.quantity;
          curItem.salesValue += Number(item.lineTotal) || 0;
          popularProductsMap.set(key, curItem);
        }
      }

      if (isPaid && !isCancelled) {
        paidOrders++;
        paidRevenue += orderTotal;

        // sales trend by day
        const dateKey = order.createdAt.toISOString().slice(0, 10);
        const curDay = salesByDate.get(dateKey) || { revenue: 0, orders: 0 };
        curDay.revenue += orderTotal;
        curDay.orders++;
        salesByDate.set(dateKey, curDay);
      }

      const custKey = (order.customerEmail || order.customerPhone || order.id).toLowerCase();
      customersSet.add(custKey);

      // order status
      const statusKey = order.orderStatus || "pending";
      const curStatus = orderStatusesMap.get(statusKey) || { count: 0, revenue: 0 };
      curStatus.count++;
      curStatus.revenue += orderTotal;
      orderStatusesMap.set(statusKey, curStatus);
    }

    const salesTrend = Array.from({ length: daysCount }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(date.getUTCDate() + index);

      const key = date.toISOString().slice(0, 10);
      const values = salesByDate.get(key) ?? {
        revenue: 0,
        orders: 0,
      };

      return {
        date: key,
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: daysCount > 14 ? "numeric" : "short",
          timeZone: "UTC",
        }),
        fullDate: date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }),
        revenue: values.revenue,
        orders: values.orders,
      };
    });

    const popularProducts = Array.from(popularProductsMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold || b.salesValue - a.salesValue)
      .slice(0, 8);

    const totalPayCount = Array.from(paymentMethodsMap.values()).reduce((sum, item) => sum + item.count, 0) || 1;
    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, item]) => ({
      method,
      count: item.count,
      revenue: item.revenue,
      percentage: Math.round((item.count / totalPayCount) * 100),
    }));

    const orderStatuses = Array.from(orderStatusesMap.entries()).map(([status, item]) => ({
      status,
      count: item.count,
      revenue: item.revenue,
    }));

    const topStates = Array.from(stateMap.entries())
      .map(([state, item]) => ({
        state,
        orders: item.orders,
        revenue: item.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue || b.orders - a.orders)
      .slice(0, 5);

    const deliveredOrders = orderStatuses.find((s) => s.status === "delivered")?.count ?? 0;
    const nonCancelledOrders = Math.max(1, totalOrders - cancelledOrders);
    const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredOrders / nonCancelledOrders) * 100) : 0;

    return NextResponse.json({
      summary: {
        totalOrders,
        cancelledOrders,
        pendingOrders: pendingCount,
        paidOrders,
        paidRevenue,
        averagePaidOrderValue: paidOrders > 0 ? paidRevenue / paidOrders : 0,
        totalCustomers: customersSet.size,
        totalDiscount,
        ordersWithCoupon,
        fulfillmentRate,
      },
      salesTrend,
      popularProducts,
      paymentMethods,
      orderStatuses,
      topStates,
      range: rangeParam,
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Admin analytics error:", error);

    return NextResponse.json(
      { message: "Unable to load analytics. Please try again." },
      { status: 500 },
    );
  }
}
