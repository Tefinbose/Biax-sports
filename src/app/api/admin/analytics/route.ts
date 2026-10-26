import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "7d";
    const daysCount = rangeParam === "90d" ? 90 : rangeParam === "30d" ? 30 : 7;

    const now = new Date();
    const startDate = new Date(now);
    startDate.setUTCDate(startDate.getUTCDate() - (daysCount - 1));
    startDate.setUTCHours(0, 0, 0, 0);

    const [
      orderStats,
      pendingCount,
      paidStats,
      recentSales,
      popularProducts,
      customerStats,
      paymentMethodStats,
      orderStatusStats,
      stateStats,
      discountStats,
    ] = await Promise.all([
      // Overall order statistics for this period
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            cancelledOrders: {
              $sum: {
                $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
              },
            },
            totalRevenueAll: { $sum: { $ifNull: ["$total", 0] } },
          },
        },
      ]),

      // Orders currently awaiting processing / pending
      Order.countDocuments({
        orderStatus: { $in: ["pending", "processing"] },
      }),

      // Count only orders marked as paid in this period
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            paidOrders: { $sum: 1 },
            paidRevenue: { $sum: { $ifNull: ["$total", 0] } },
          },
        },
      ]),

      // Daily paid revenue over the selected period
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            revenue: { $sum: { $ifNull: ["$total", 0] } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Best-selling products by quantity, excluding cancelled orders
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: {
              $ifNull: ["$items.productId", "$items.name"],
            },
            name: { $first: "$items.name" },
            slug: { $first: "$items.slug" },
            image: { $first: "$items.image" },
            quantitySold: {
              $sum: { $ifNull: ["$items.quantity", 0] },
            },
            salesValue: {
              $sum: { $ifNull: ["$items.lineTotal", 0] },
            },
          },
        },
        { $sort: { quantitySold: -1, salesValue: -1 } },
        { $limit: 8 },
        {
          $project: {
            _id: 0,
            name: 1,
            slug: 1,
            image: 1,
            quantitySold: 1,
            salesValue: 1,
          },
        },
      ]),

      // Unique customers in period
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $toLower: {
                $ifNull: [
                  "$customer.email",
                  {
                    $ifNull: ["$customer.phone", { $toString: "$_id" }],
                  },
                ],
              },
            },
          },
        },
        { $count: "totalCustomers" },
      ]),

      // Payment method breakdown (COD vs Online)
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$paymentMethod", "cod"] },
            count: { $sum: 1 },
            revenue: { $sum: { $ifNull: ["$total", 0] } },
          },
        },
      ]),

      // Order status distribution
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: { $ifNull: ["$orderStatus", "pending"] },
            count: { $sum: 1 },
            revenue: { $sum: { $ifNull: ["$total", 0] } },
          },
        },
      ]),

      // Regional demand by Indian state
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            "shippingAddress.state": { $exists: true, $ne: "" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: "$shippingAddress.state",
            orders: { $sum: 1 },
            revenue: { $sum: { $ifNull: ["$total", 0] } },
          },
        },
        { $sort: { revenue: -1, orders: -1 } },
        { $limit: 5 },
      ]),

      // Coupon / discount stats
      Order.aggregate([
        {
          $match: {
            orderStatus: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            totalDiscount: { $sum: { $ifNull: ["$discountAmount", 0] } },
            ordersWithCoupon: {
              $sum: {
                $cond: [{ $gt: [{ $ifNull: ["$discountAmount", 0] }, 0] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    // Fill missing dates with zero so charts have unbroken time series
    const salesByDate = new Map<string, { revenue: number; orders: number }>();
    for (const item of recentSales) {
      salesByDate.set(item._id, {
        revenue: item.revenue,
        orders: item.orders,
      });
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

    const totalOrders = orderStats[0]?.totalOrders ?? 0;
    const cancelledOrders = orderStats[0]?.cancelledOrders ?? 0;
    const paidOrders = paidStats[0]?.paidOrders ?? 0;
    const paidRevenue = paidStats[0]?.paidRevenue ?? 0;
    const totalCustomers = customerStats[0]?.totalCustomers ?? 0;
    const totalDiscount = discountStats[0]?.totalDiscount ?? 0;
    const ordersWithCoupon = discountStats[0]?.ordersWithCoupon ?? 0;

    // Normalize payment methods
    const totalPayCount = paymentMethodStats.reduce((sum, item) => sum + item.count, 0) || 1;
    const paymentMethods = paymentMethodStats.map((item) => ({
      method: (item._id as string).toLowerCase(),
      count: item.count,
      revenue: item.revenue,
      percentage: Math.round((item.count / totalPayCount) * 100),
    }));

    // Normalize order statuses
    const orderStatuses = orderStatusStats.map((item) => ({
      status: item._id as string,
      count: item.count,
      revenue: item.revenue,
    }));

    // Normalize states
    const topStates = stateStats.map((item) => ({
      state: item._id as string,
      orders: item.orders,
      revenue: item.revenue,
    }));

    const deliveredOrders =
      orderStatuses.find((s) => s.status === "delivered")?.count ?? 0;
    const nonCancelledOrders = Math.max(1, totalOrders - cancelledOrders);
    const fulfillmentRate =
      totalOrders > 0
        ? Math.round((deliveredOrders / nonCancelledOrders) * 100)
        : 0;

    return NextResponse.json({
      summary: {
        totalOrders,
        cancelledOrders,
        pendingOrders: pendingCount,
        paidOrders,
        paidRevenue,
        averagePaidOrderValue: paidOrders > 0 ? paidRevenue / paidOrders : 0,
        totalCustomers,
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
