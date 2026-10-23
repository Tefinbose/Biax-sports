
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/admin/admin-sidebar";
import {
  FiRefreshCw,
  FiSearch,
  FiShoppingCart,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLoader,
} from "react-icons/fi";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    lineTotal: number;
  }>;
  subtotal: number;
  shippingCharge: number;
  couponCode?: string;
  discountAmount?: number;
  total: number;
  paymentMethod: "cod" | "online";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: OrderStatus;
  createdAt: string;
};

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

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

function statusStyle(status: string) {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-green-100 text-green-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    case "shipped":
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (status !== "all") {
          params.set("status", status);
        }

        const response = await fetch(
          `/api/admin/orders?${params.toString()}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load orders.",
          );
        }

        if (!cancelled) {
          setOrders(result.orders ?? []);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load orders.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [search, status, refreshKey]);

  async function updateStatus(
    orderId: string,
    orderStatus: OrderStatus,
  ) {
    setUpdatingId(orderId);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, orderStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update order status.",
        );
      }

      setNotice(
        `Order ${result.order.orderNumber} updated successfully.`,
      );
      setRefreshKey((value) => value + 1);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update order status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Existing admin navigation */}
      <AdminSidebar />

      {/* Main content sits beside the sidebar on desktop */}
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:ml-72 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
                BIAX SPORTS / ADMIN
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-gray-950">
                Order Management
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                View customer orders and manage their progress.
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
                Refresh Orders
              </button>
            </div>
          </div>

          {/* Order statistics */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Orders in this view</p>
                <FiShoppingCart className="text-red-600 text-xl" />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-950">
                {orders.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Pending orders in this view</p>
                <FiClock className="text-amber-600 text-xl" />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-950">
                {
                  orders.filter(
                    (order) => order.orderStatus === "pending",
                  ).length
                }
              </p>
            </div>
          </div>

          {/* Search and filters */}
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label
                  htmlFor="order-search"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Search orders
                </label>

                <div className="relative mt-2">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                  <input
                    id="order-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Order number, customer, email, or phone"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Filter by status
                </label>

                <select
                  id="status-filter"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-600"
                >
                  <option value="all">All statuses</option>
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <FiAlertCircle className="mt-0.5 text-lg shrink-0" />
                <div>
                  <p>{error}</p>
                  {error.toLowerCase().includes("unauthorized") && (
                    <p className="mt-2">
                      <Link
                        href="/admin/login"
                        className="font-bold underline"
                      >
                        Go to admin login
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            )}

            {notice && (
              <p
                role="status"
                className="mt-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <FiCheckCircle className="text-lg shrink-0" />
                {notice}
              </p>
            )}

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                <FiLoader className="mx-auto mb-2 text-2xl animate-spin text-red-600" />
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center">
                <FiShoppingCart className="mx-auto text-4xl text-gray-300 mb-2" />
                <h2 className="text-lg font-bold text-gray-900">
                  No orders found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Orders will appear here after customers place them.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {orders.map((order) => (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 bg-gray-50 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="font-bold text-gray-950">
                          {order.orderNumber}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(order.paymentStatus)}`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                          <FiUser /> Customer
                        </h3>
                        <p className="mt-2 font-semibold text-gray-950">
                          {order.customer.name}
                        </p>
                        <p className="mt-1 break-all text-sm text-gray-600">
                          {order.customer.email}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {order.customer.phone}
                        </p>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                          <FiMapPin /> Delivery Address
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2
                            ? `, ${order.shippingAddress.addressLine2}`
                            : ""}
                          <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                          <br />
                          {order.shippingAddress.postalCode}
                          <br />
                          {order.shippingAddress.country}
                        </p>
                      </div>

                      <div>
                        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                          <FiCreditCard /> Payment & Total
                        </h3>
                        <p className="mt-2 text-sm text-gray-700">
                          Method:{" "}
                          <span className="font-semibold">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Online"}
                          </span>
                        </p>
                        <p className="mt-2 text-xl font-extrabold text-gray-950">
                          {formatPrice(order.total)}
                        </p>
                        {order.couponCode && (order.discountAmount ?? 0) > 0 ? (
                          <p className="mt-1 text-xs font-bold text-emerald-600">
                            Coupon {order.couponCode}: -{formatPrice(order.discountAmount || 0)}
                          </p>
                        ) : null}
                        <p className="mt-1 text-xs text-gray-500">
                          Shipping: {formatPrice(order.shippingCharge)}
                        </p>
                      </div>
                    </div>

                    {/* Ordered products */}
                    <div className="border-t border-gray-200 p-4">
                      <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                        <FiPackage className="text-red-600" /> Items ordered
                      </h3>

                      <div className="mt-3 space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-center"
                          >
                            <span className="text-gray-700">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-950">
                              {formatPrice(item.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Update order status */}
                      <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <label
                          htmlFor={`status-${order._id}`}
                          className="text-sm font-semibold text-gray-700"
                        >
                          Update order status
                        </label>

                        <select
                          id={`status-${order._id}`}
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(event) =>
                            void updateStatus(
                              order._id,
                              event.target.value as OrderStatus,
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-red-600 disabled:opacity-60 sm:min-w-48"
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item.charAt(0).toUpperCase() +
                                item.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {updatingId === order._id && (
                        <p className="mt-2 text-xs text-gray-500">
                          Updating order...
                        </p>
                      )}
                    </div>
                  </article>
                ))}

                <p className="text-xs text-gray-500">
                  Showing up to 200 matching orders, newest first.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
