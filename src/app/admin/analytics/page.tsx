
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/admin-sidebar";
import {
  FiShoppingBag,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiBarChart2,
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa6";

type Summary = {
  totalOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  paidOrders: number;
  paidRevenue: number;
  averagePaidOrderValue: number;
  totalCustomers: number;
};

type SalesDay = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

type PopularProduct = {
  name: string;
  quantitySold: number;
  salesValue: number;
};

type AnalyticsData = {
  summary: Summary;
  salesTrend: SalesDay[];
  popularProducts: PopularProduct[];
  generatedAt: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/analytics", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load analytics.",
          );
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const maxRevenue = Math.max(
    ...(data?.salesTrend.map((day) => day.revenue) ?? [0]),
    1,
  );

  const summary = data?.summary;

  const stats = [
    {
      title: "Total Orders",
      value: summary?.totalOrders ?? 0,
      description: "All orders received",
      icon: FiShoppingBag,
    },
    {
      title: "Paid Revenue",
      value: formatPrice(summary?.paidRevenue ?? 0),
      description: "Orders marked as paid",
      icon: FaRupeeSign,
    },
    {
      title: "Pending Orders",
      value: summary?.pendingOrders ?? 0,
      description: "Awaiting processing",
      icon: FiClock,
    },
    {
      title: "Total Customers",
      value: summary?.totalCustomers ?? 0,
      description: "Estimated unique customers",
      icon: FiUsers,
    },
    {
      title: "Paid Orders",
      value: summary?.paidOrders ?? 0,
      description: "Orders marked as paid",
      icon: FiCheckCircle,
    },
    {
      title: "Average Paid Order",
      value: formatPrice(summary?.averagePaidOrderValue ?? 0),
      description: "Average value per paid order",
      icon: FiTrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="min-h-screen p-4 sm:p-6 lg:ml-72 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                BIAX SPORTS / ADMIN
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-gray-950">
                Analytics
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Track your store performance and product sales.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Refresh Data
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <FiAlertCircle className="mt-0.5 text-lg shrink-0" />
              <div>
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setRefreshKey((value) => value + 1)}
                  className="ml-2 font-bold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="mt-8 rounded-xl border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">
              <FiLoader className="mx-auto mb-2 text-2xl animate-spin text-red-600" />
              Loading analytics...
            </div>
          ) : data ? (
            <>
              {/* Summary cards */}
              <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-600">
                          {stat.title}
                        </p>

                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          <Icon className="text-xl" />
                        </span>
                      </div>

                      <p className="mt-4 break-words text-2xl font-extrabold text-gray-950">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  );
                })}
              </section>

              {/* Sales trend */}
              <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-950">
                      Paid Revenue Trend
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Daily revenue for the last seven calendar days.
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    {
                      data.salesTrend.reduce(
                        (sum, day) => sum + day.orders,
                        0,
                      )
                    }{" "}
                    paid orders
                  </p>
                </div>

                <div className="mt-8 space-y-5">
                  {data.salesTrend.map((day) => {
                    const width =
                      day.revenue === 0
                        ? 0
                        : Math.max(
                            (day.revenue / maxRevenue) * 100,
                            2,
                          );

                    return (
                      <div
                        key={day.date}
                        className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[80px_minmax(0,1fr)_140px]"
                      >
                        <span className="text-xs text-gray-500 sm:text-sm">
                          {day.label}
                        </span>

                        <div className="h-7 overflow-hidden rounded-md bg-gray-100">
                          <div
                            className="flex h-full items-center rounded-md bg-red-600 px-2 transition-all"
                            style={{ width: `${width}%` }}
                            title={formatPrice(day.revenue)}
                          />
                        </div>

                        <div className="col-span-2 flex justify-between text-xs text-gray-600 sm:col-span-1 sm:block sm:text-right sm:text-sm">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(day.revenue)}
                          </span>
                          <span className="sm:mt-1 sm:block">
                            {day.orders} orders
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-6 text-xs text-gray-500">
                  Days with no paid orders show zero revenue. Dates are
                  grouped using UTC.
                </p>
              </section>

              {/* Popular products */}
              <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
                <h2 className="text-lg font-bold text-gray-950">
                  Popular Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Ranked by quantity in non-cancelled orders.
                </p>

                {data.popularProducts.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500">
                    Product sales will appear here when orders contain
                    products.
                  </div>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                          <th className="py-3 pr-4">Product</th>
                          <th className="px-4 py-3">Quantity sold</th>
                          <th className="py-3 pl-4 text-right">
                            Order value
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.popularProducts.map((product, index) => (
                          <tr
                            key={`${product.name}-${index}`}
                            className="border-b border-gray-100 last:border-0"
                          >
                            <td className="py-4 pr-4 font-semibold text-gray-900">
                              {product.name || "Unnamed product"}
                            </td>

                            <td className="px-4 py-4 text-gray-700">
                              {product.quantitySold}
                            </td>

                            <td className="py-4 pl-4 text-right font-semibold text-gray-900">
                              {formatPrice(product.salesValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-semibold text-amber-900">
                  About these figures
                </h3>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  Paid revenue includes orders marked as paid and excludes
                  cancelled orders. Popular product values include items
                  from non-cancelled orders, including orders that may
                  still be unpaid. These figures depend on your order
                  records and payment-status updates.
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Last fetched: {formatDate(data.generatedAt)}
              </p>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
