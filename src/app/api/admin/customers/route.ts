
import { NextRequest, NextResponse } from "next/server";
import type { PipelineStage } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";



function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const search = request.nextUrl.searchParams
      .get("search")
      ?.trim()
      .slice(0, 100);

    const pipeline: PipelineStage[] = [
      // Show each customer's latest order first.
      { $sort: { createdAt: -1 } },

      // Combine orders belonging to the same customer.
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
          name: { $first: "$customer.name" },
          email: { $first: "$customer.email" },
          phone: { $first: "$customer.phone" },
          latestAddress: { $first: "$shippingAddress" },
          orderCount: { $sum: 1 },
          totalOrderValue: {
            $sum: {
              $cond: [
                { $ne: ["$orderStatus", "cancelled"] },
                { $ifNull: ["$total", 0] },
                0,
              ],
            },
          },
          lastOrderAt: { $first: "$createdAt" },
          latestOrderNumber: { $first: "$orderNumber" },
        },
      },
    ];

    if (search) {
      const safeSearch = new RegExp(escapeRegex(search), "i");

      pipeline.push({
        $match: {
          $or: [
            { name: safeSearch },
            { email: safeSearch },
            { phone: safeSearch },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { lastOrderAt: -1 } },
      { $limit: 500 },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          email: 1,
          phone: 1,
          latestAddress: 1,
          orderCount: 1,
          totalOrderValue: 1,
          lastOrderAt: 1,
          latestOrderNumber: 1,
        },
      },
    );

    const customers = await Order.aggregate(pipeline);

    return NextResponse.json({
      customers,
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
