"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/components/admin/admin-sidebar";
import RevenueChart, { type SalesDay } from "@/components/admin/analytics/revenue-chart";
import PaymentDonut from "@/components/admin/analytics/payment-donut";
import OrderPipeline from "@/components/admin/analytics/order-pipeline";
import RegionalDemand from "@/components/admin/analytics/regional-demand";
import {
  FiShoppingBag,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiRefreshCw,
  FiAlertCircle,
  FiDownload,
  FiTag,
  FiArrowUpRight,
  FiPackage,
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
  totalDiscount: number;
  ordersWithCoupon: number;
  fulfillmentRate: number;
};

type PopularProduct = {
  name: string;
  slug?: string;
  image?: string;
  quantitySold: number;
  salesValue: number;
};

type PaymentMethodStat = {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
};

type StatusStat = {
  status: string;
  count: number;
  revenue: number;
};

type StateDemandItem = {
  state: string;
  orders: number;
  revenue: number;
};

type AnalyticsData = {
  summary: Summary;
  salesTrend: SalesDay[];
  popularProducts: PopularProduct[];
  paymentMethods: PaymentMethodStat[];
  orderStatuses: StatusStat[];
  topStates: StateDemandItem[];
  range: "7d" | "30d" | "90d";
  generatedAt: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
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
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/analytics?range=${range}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load analytics.");
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Something went wrong loading analytics.",
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
  }, [range, refreshKey]);

  // Export current period report to CSV
  function handleExportCSV() {
    if (!data) return;

    const rows: string[][] = [
      ["BIAX SPORTS ANALYTICS REPORT"],
      [`Generated at: ${new Date(data.generatedAt).toLocaleString("en-IN")}`],
      [`Time Period: Last ${data.range.toUpperCase()}`],
      [],
      ["EXECUTIVE SUMMARY"],
      ["Metric", "Value"],
      ["Paid Revenue", formatPrice(data.summary.paidRevenue)],
      ["Total Orders", data.summary.totalOrders.toString()],
      ["Paid Orders", data.summary.paidOrders.toString()],
      ["Cancelled Orders", data.summary.cancelledOrders.toString()],
      ["Average Order Value", formatPrice(data.summary.averagePaidOrderValue)],
      ["Unique Customers", data.summary.totalCustomers.toString()],
      ["Total Discounts Given", formatPrice(data.summary.totalDiscount)],
      ["Fulfillment Rate", `${data.summary.fulfillmentRate}%`],
      [],
      ["DAILY SALES TREND"],
      ["Date", "Label", "Paid Revenue (INR)", "Paid Orders"],
      ...data.salesTrend.map((d) => [
        d.date,
        d.label,
        d.revenue.toString(),
        d.orders.toString(),
      ]),
      [],
      ["POPULAR PRODUCTS"],
      ["Product Name", "Units Sold", "Total Order Value (INR)"],
      ...data.popularProducts.map((p) => [
        p.name,
        p.quantitySold.toString(),
        p.salesValue.toString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `biax-analytics-${data.range}-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const summary = data?.summary;

  const kpis = [
    {
      title: "Paid Revenue",
      value: formatPrice(summary?.paidRevenue ?? 0),
      description: `${summary?.paidOrders ?? 0} confirmed paid orders`,
      icon: FaRupeeSign,
      accent: "bg-red-50 text-primary border-red-100",
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders ?? 0,
      description: `${summary?.cancelledOrders ?? 0} cancelled (${
        summary?.totalOrders
          ? Math.round(
              ((summary.totalOrders - summary.cancelledOrders) /
                summary.totalOrders) *
                100,
            )
          : 0
      }% completion rate)`,
      icon: FiShoppingBag,
      accent: "bg-neutral-100 text-neutral-900 border-neutral-200",
    },
    {
      title: "Average Order Value",
      value: formatPrice(summary?.averagePaidOrderValue ?? 0),
      description: "Net revenue per paid checkout",
      icon: FiTrendingUp,
      accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Unique Customers",
      value: summary?.totalCustomers ?? 0,
      description: "Verified customer accounts & guests",
      icon: FiUsers,
      accent: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Pending Fulfillment",
      value: summary?.pendingOrders ?? 0,
      description: "Orders awaiting dispatch from Kerala",
      icon: FiClock,
      accent: "bg-amber-50 text-amber-700 border-amber-100",
      href: "/admin/orders?status=pending",
    },
    {
      title: "Discounts & Savings",
      value: formatPrice(summary?.totalDiscount ?? 0),
      description: `${summary?.ordersWithCoupon ?? 0} orders used promotional coupons`,
      icon: FiTag,
      accent: "bg-purple-50 text-purple-700 border-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <AdminSidebar />

      <main className="min-h-screen p-4 sm:p-6 lg:ml-72 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header row */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-neutral-200/80 pb-6">
            <div>
              <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.24em] text-primary">
                BIAX SPORTS / ADMIN
              </p>

              <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-950">
                Store Analytics
              </h1>

              <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
                Revenue metrics, order volume, payment channels, and product sales.
              </p>
            </div>

            {/* Actions: Time Range Filter + Refresh + Export */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Range Selector Pills */}
              <div className="flex items-center rounded-xl bg-white p-1 border border-neutral-200 shadow-sm">
                {(["7d", "30d", "90d"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                      range === r
                        ? "bg-neutral-950 text-white shadow-sm"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                title="Refresh Analytics Data"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-950 active:scale-95"
              >
                <FiRefreshCw className={loading ? "animate-spin text-primary" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={!data || loading}
                title="Download CSV Report"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
              >
                <FiDownload />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800"
            >
              <FiAlertCircle className="mt-0.5 text-lg shrink-0 text-red-600" />
              <div className="flex-1">
                <span className="font-medium">{error}</span>
                <button
                  type="button"
                  onClick={() => setRefreshKey((v) => v + 1)}
                  className="ml-3 font-bold underline hover:no-underline"
                >
                  Try refreshing data
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !data ? (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl border border-neutral-200 bg-white p-5 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-80 rounded-2xl border border-neutral-200 bg-white p-6 animate-pulse" />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-72 rounded-2xl border border-neutral-200 bg-white p-6 animate-pulse" />
                <div className="h-72 rounded-2xl border border-neutral-200 bg-white p-6 animate-pulse" />
              </div>
            </div>
          ) : data ? (
            <div className="mt-8 space-y-8">
              {/* 1. Executive KPIs Grid */}
              <section aria-label="Key Performance Indicators">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    const CardWrapper = kpi.href ? Link : "div";

                    return (
                      <CardWrapper
                        key={kpi.title}
                        // @ts-expect-error Link accepts href, div ignores it safely
                        href={kpi.href}
                        className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                          kpi.href ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                            {kpi.title}
                          </p>
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border ${kpi.accent} shrink-0`}
                          >
                            <Icon className="text-sm stroke-[2.2]" />
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-lg sm:text-2xl font-black tracking-tight text-neutral-950 font-sans leading-none">
                            {kpi.value}
                          </p>
                          <p className="mt-2 text-[10px] sm:text-[11px] text-neutral-500 font-medium leading-tight">
                            {kpi.description}
                          </p>
                        </div>
                      </CardWrapper>
                    );
                  })}
                </div>
              </section>

              {/* 2. Interactive Revenue & Order Timeline Chart */}
              <section aria-label="Sales and Revenue Velocity Chart">
                <RevenueChart data={data.salesTrend} range={data.range} />
              </section>

              {/* 3. Middle 2-Column: Payment Methods & Order Fulfillment Pipeline */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Payment Methods Donut */}
                <PaymentDonut methods={data.paymentMethods} />

                {/* Fulfillment Lifecycle Pipeline */}
                <OrderPipeline
                  statuses={data.orderStatuses}
                  totalOrders={data.summary.totalOrders}
                  fulfillmentRate={data.summary.fulfillmentRate}
                />
              </section>

              {/* 4. Bottom 2-Column: Top Products & Regional Geographic Demand */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Popular Products Leaderboard (8 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-primary">
                          <FiPackage size={15} />
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
                            Best-Selling Products
                          </h3>
                          <p className="text-[11px] text-neutral-500 font-medium">
                            Ranked by units sold in confirmed orders
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/admin/products"
                        className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        All Products <FiArrowUpRight size={12} />
                      </Link>
                    </div>

                    {data.popularProducts.length === 0 ? (
                      <div className="py-12 text-center text-xs text-neutral-400">
                        Product sales will appear here as orders are placed.
                      </div>
                    ) : (
                      <div className="mt-4 divide-y divide-neutral-100">
                        {data.popularProducts.map((product, index) => {
                          const maxQty = Math.max(
                            ...data.popularProducts.map((p) => p.quantitySold),
                            1,
                          );
                          const barWidth = Math.round(
                            (product.quantitySold / maxQty) * 100,
                          );

                          const medalColors =
                            index === 0
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : index === 1
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : index === 2
                              ? "bg-amber-50 text-amber-900 border-amber-200"
                              : "bg-neutral-100 text-neutral-600 border-neutral-200";

                          return (
                            <div
                              key={`${product.name}-${index}`}
                              className="group flex flex-col py-3.5 sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors hover:bg-neutral-50/70 -mx-3 px-3 rounded-xl"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${medalColors}`}
                                >
                                  {index + 1}
                                </span>

                                <div className="min-w-0">
                                  {product.slug ? (
                                    <Link
                                      href={`/products/${product.slug}`}
                                      target="_blank"
                                      className="font-bold text-xs sm:text-sm text-neutral-900 hover:text-primary transition-colors truncate block"
                                    >
                                      {product.name}
                                    </Link>
                                  ) : (
                                    <p className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                                      {product.name}
                                    </p>
                                  )}

                                  {/* Visual Demand Progress Track */}
                                  <div className="mt-1 flex items-center gap-2">
                                    <div className="h-1.5 w-24 sm:w-36 rounded-full bg-neutral-100 overflow-hidden">
                                      <div
                                        style={{ width: `${barWidth}%` }}
                                        className="h-full rounded-full bg-primary"
                                      />
                                    </div>
                                    <span className="text-[10px] text-neutral-400 font-mono">
                                      {product.quantitySold} units
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-baseline justify-between sm:flex-col sm:items-end shrink-0">
                                <span className="font-black text-sm text-neutral-950">
                                  {formatPrice(product.salesValue)}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-medium">
                                  Avg: {product.quantitySold > 0 ? formatPrice(product.salesValue / product.quantitySold) : "₹0"} / unit
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Regional Demand (5 cols) */}
                <div className="lg:col-span-5">
                  <RegionalDemand states={data.topStates} />
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
