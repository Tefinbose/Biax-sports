
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET() {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const now = new Date();
    const startDate = new Date(now);
    startDate.setUTCDate(startDate.getUTCDate() - 6);
    startDate.setUTCHours(0, 0, 0, 0);

    const [
      orderStats,
      pendingCount,
      paidStats,
      recentSales,
      popularProducts,
      customerStats,
    ] = await Promise.all([
      // Overall order statistics.
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            cancelledOrders: {
              $sum: {
                $cond: [
                  { $eq: ["$orderStatus", "cancelled"] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Orders awaiting processing.
      Order.countDocuments({
        orderStatus: "pending",
      }),

      // Count only orders marked as paid.
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            orderStatus: { $ne: "cancelled" },
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

      // Daily paid revenue over the last seven calendar days.
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

      // Best-selling products by quantity, excluding cancelled orders.
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: {
              $ifNull: ["$items.productId", "$items.name"],
            },
            name: { $first: "$items.name" },
            quantitySold: {
              $sum: { $ifNull: ["$items.quantity", 0] },
            },
            salesValue: {
              $sum: { $ifNull: ["$items.lineTotal", 0] },
            },
          },
        },
        { $sort: { quantitySold: -1, salesValue: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            name: 1,
            quantitySold: 1,
            salesValue: 1,
          },
        },
      ]),

      // Approximate unique customers from order contact details.
      Order.aggregate([
        {
          $group: {
            _id: {
              $toLower: {
                $ifNull: [
                  "$customer.email",
                  {
                    $ifNull: [
                      "$customer.phone",
                      { $toString: "$_id" },
                    ],
                  },
                ],
              },
            },
          },
        },
        { $count: "totalCustomers" },
      ]),
    ]);

    // Fill missing dates with zero so the chart always has seven days.
    const salesByDate = new Map<
      string,
      { revenue: number; orders: number }
    >();

    for (const item of recentSales) {
      salesByDate.set(item._id, {
        revenue: item.revenue,
        orders: item.orders,
      });
    }

    const salesTrend = Array.from({ length: 7 }, (_, index) => {
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
          month: "short",
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

    return NextResponse.json({
      summary: {
        totalOrders,
        cancelledOrders,
        pendingOrders: pendingCount,
        paidOrders,
        paidRevenue,
        averagePaidOrderValue:
          paidOrders > 0 ? paidRevenue / paidOrders : 0,
        totalCustomers: customerStats[0]?.totalCustomers ?? 0,
      },
      salesTrend,
      popularProducts,
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
