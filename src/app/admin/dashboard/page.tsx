import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiBarChart2,
  FiPlus,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTag,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa6";

import { getAdminSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminLogoutButton from "@/components/admin/logout-button";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: IconType;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight text-neutral-900">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#d71920]">
          <Icon className="text-xl" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-700">{description}</span>
      </div>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "paid":
      return "bg-emerald-100 text-emerald-800";
    case "shipped":
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

async function DashboardContent() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  await connectToDatabase();

  const now = new Date();
  const startDate = new Date(now);
  startDate.setUTCDate(startDate.getUTCDate() - 6);
  startDate.setUTCHours(0, 0, 0, 0);

  // Fetch real data from MongoDB in parallel
  const [
    orderStats,
    totalProducts,
    uniqueCustomers,
    recentSales,
    recentOrders,
    activeCoupons,
  ] = await Promise.all([
    // Aggregate overall order stats & revenue
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          paidRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentStatus", "paid"] },
                    { $ne: ["$orderStatus", "cancelled"] },
                  ],
                },
                { $ifNull: ["$total", 0] },
                0,
              ],
            },
          },
          paidOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentStatus", "paid"] },
                    { $ne: ["$orderStatus", "cancelled"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),

    // Total products in store
    Product.countDocuments(),

    // Count distinct customer emails
    Order.distinct("customer.email"),

    // 7-day sales aggregation
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

    // Recent 5 orders
    Order.find({})
      .select("orderNumber customer total orderStatus paymentStatus createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // Active coupons in store
    Coupon.countDocuments({ active: true }),
  ]);

  const totalOrders = orderStats[0]?.totalOrders ?? 0;
  const paidRevenue = orderStats[0]?.paidRevenue ?? 0;
  const customerCount = uniqueCustomers.length;

  // Build full 7-day trend array
  const salesByDate = new Map<string, { revenue: number; orders: number }>();
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
    const values = salesByDate.get(key) ?? { revenue: 0, orders: 0 };
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

  const maxRevenue = Math.max(...salesTrend.map((d) => d.revenue), 1);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <AdminSidebar />

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 flex min-h-[88px] items-center justify-between gap-4 border-b border-neutral-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d71920]">
              Store Management
            </p>
            <h1 className="mt-1 text-xl font-black text-neutral-900 sm:text-2xl">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-neutral-800">
                Administrator
              </p>
              <p className="max-w-52 truncate text-xs text-neutral-500">
                {session.email}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 font-bold text-[#d71920]">
              {session.email.charAt(0).toUpperCase()}
            </div>

            <AdminLogoutButton />
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-8 p-5 sm:p-8">
          {/* Welcome Banner - Clean, Professional (No AI symbols/badges) */}
          <section className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-9 shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                Welcome back to{" "}
                <span className="text-[#f0444b]">BIAX SPORTS.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
                Manage your product catalogue, track incoming customer orders,
                and monitor live store analytics from your control centre.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d71920] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <FiPlus className="text-lg" />
                  Manage products
                  <FiArrowUpRight className="text-base" />
                </Link>

                <Link
                  href="/admin/coupons"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <FiTag className="text-base" />
                  Coupons & Promos
                  <FiArrowRight className="text-base" />
                </Link>

                <Link
                  href="/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View storefront
                  <FiArrowRight className="text-base" />
                </Link>
              </div>
            </div>
          </section>

          {/* Metric Overview Cards - Connected with MongoDB */}
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-neutral-900">
                  Store Overview
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Live metrics synced directly from your database.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600">
                <FiCalendar className="text-sm" />
                Live Store Data
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                title="Total Revenue"
                value={formatPrice(paidRevenue)}
                description="Verified paid orders"
                icon={FaRupeeSign}
              />

              <MetricCard
                title="Total Orders"
                value={String(totalOrders)}
                description="Orders placed by customers"
                icon={FiShoppingCart}
              />

              <MetricCard
                title="Catalogue Products"
                value={String(totalProducts)}
                description="Products in your inventory"
                icon={FiPackage}
              />

              <MetricCard
                title="Unique Customers"
                value={String(customerCount)}
                description="Customers who have ordered"
                icon={FiUsers}
              />

              <MetricCard
                title="Active Coupons"
                value={String(activeCoupons)}
                description="Live promotion discounts"
                icon={FiTag}
              />
            </div>
          </section>

          {/* Analytics Chart & Quick Navigation */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-neutral-900">
                    7-Day Paid Sales Performance
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Daily completed revenue for the past seven days.
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-[#d71920]">
                  <FiBarChart2 className="text-xl" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {salesTrend.map((day) => {
                  const widthPercent =
                    day.revenue === 0
                      ? 0
                      : Math.max((day.revenue / maxRevenue) * 100, 3);

                  return (
                    <div
                      key={day.date}
                      className="grid grid-cols-[65px_1fr_120px] items-center gap-4 text-sm"
                    >
                      <span className="font-medium text-neutral-500 text-xs sm:text-sm">
                        {day.label}
                      </span>

                      <div className="h-6 w-full overflow-hidden rounded-md bg-neutral-100">
                        <div
                          className="h-full rounded-md bg-[#d71920] transition-all duration-300"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                          {formatPrice(day.revenue)}
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          {day.orders} {day.orders === 1 ? "order" : "orders"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                <span>Updated in real-time</span>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center gap-1 font-bold text-[#d71920] hover:underline"
                >
                  Full analytics report
                  <FiArrowRight />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-neutral-900">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Frequently used administration tasks.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/admin/products"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#d71920]">
                    <FiPackage className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Manage Products
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Add, update and publish items
                    </span>
                  </span>
                  <FiArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]" />
                </Link>

                <Link
                  href="/admin/orders"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <FiShoppingCart className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      View Orders
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Track and process customer orders
                    </span>
                  </span>
                  <FiArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]" />
                </Link>

                <Link
                  href="/admin/coupons"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#d71920]">
                    <FiTag className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Coupons & Discounts
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Create, track, and manage promo codes
                    </span>
                  </span>
                  <FiArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]" />
                </Link>

                <Link
                  href="/admin/customers"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <FiUsers className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Customers
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Directory and order histories
                    </span>
                  </span>
                  <FiArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]" />
                </Link>

                <Link
                  href="/admin/settings"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <FiTrendingUp className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Store Settings
                    </span>
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      Delivery charges and contact info
                    </span>
                  </span>
                  <FiArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]" />
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Orders - Live Database Connection */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-neutral-900">
                  Recent Orders
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Latest customer orders placed on your store.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                View all orders
                <FiArrowRight />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="mt-6 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
                  <FiShoppingCart className="text-lg" />
                </div>
                <p className="mt-3 text-sm font-bold text-neutral-700">
                  No orders recorded yet
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  When customers place orders at checkout, they will appear here
                  instantly.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
                      <th className="py-3 pr-4 font-bold">Order #</th>
                      <th className="px-4 py-3 font-bold">Customer</th>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Payment</th>
                      <th className="py-3 pl-4 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {recentOrders.map((order: any) => (
                      <tr
                        key={String(order._id)}
                        className="hover:bg-neutral-50/50 transition"
                      >
                        <td className="py-3.5 pr-4 font-bold text-neutral-900">
                          <Link
                            href="/admin/orders"
                            className="hover:text-[#d71920] hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-neutral-800">
                          {order.customer?.name || "Customer"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-neutral-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusBadge(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 pl-4 text-right font-black text-neutral-900">
                          {formatPrice(order.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 py-5 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} BIAX SPORTS. All rights reserved.</p>
            <p className="font-semibold">BIAX SPORTS Administration Control</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-neutral-100">
          <p className="text-sm font-semibold text-neutral-500">
            Loading dashboard data...
          </p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
