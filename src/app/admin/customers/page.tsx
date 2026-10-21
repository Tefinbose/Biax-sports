
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import  AdminSidebar from "@/components/admin/admin-sidebar";

type Customer = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  latestAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orderCount: number;
  totalOrderValue: number;
  lastOrderAt?: string;
  latestOrderNumber?: string;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(parsed);
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/admin/customers?${params.toString()}`,
          { cache: "no-store" },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load customers.",
          );
        }

        if (!cancelled) {
          setCustomers(result.customers ?? []);
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

    void loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [search, refreshKey]);

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orderCount,
    0,
  );

  const totalOrderValue = customers.reduce(
    (sum, customer) => sum + customer.totalOrderValue,
    0,
  );

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
                Customers
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                View customer details and purchasing history.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">
                Customers in this view
              </p>
              <p className="mt-2 text-3xl font-extrabold text-gray-950">
                {customers.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">
                Orders from these customers
              </p>
              <p className="mt-2 text-3xl font-extrabold text-gray-950">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">
                Non-cancelled order value
              </p>
              <p className="mt-2 text-2xl font-extrabold text-gray-950">
                {formatPrice(totalOrderValue)}
              </p>
            </div>
          </div>

          {/* Customer list */}
          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  Customer directory
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search by customer name, email, or phone.
                </p>
              </div>

              <div className="w-full sm:max-w-sm">
                <label
                  htmlFor="customer-search"
                  className="sr-only"
                >
                  Search customers
                </label>

                <input
                  id="customer-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customers..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}

                <button
                  type="button"
                  onClick={() => setRefreshKey((value) => value + 1)}
                  className="ml-2 font-bold underline"
                >
                  Try again
                </button>

                {error.toLowerCase().includes("unauthorized") && (
                  <Link
                    href="/admin/login"
                    className="ml-3 font-bold underline"
                  >
                    Admin login
                  </Link>
                )}
              </div>
            )}

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-500">
                Loading customers...
              </div>
            ) : customers.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  No customers found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Customers will appear here after placing orders.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-4 md:hidden">
                  {customers.map((customer) => (
                    <article
                      key={customer.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                          {(customer.name || "C")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-bold text-gray-950">
                            {customer.name || "Unnamed customer"}
                          </h3>
                          <p className="mt-1 break-all text-sm text-gray-600">
                            {customer.email || "No email"}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {customer.phone || "No phone"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500">Orders</p>
                          <p className="mt-1 font-bold text-gray-900">
                            {customer.orderCount}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Order value
                          </p>
                          <p className="mt-1 font-bold text-gray-900">
                            {formatPrice(customer.totalOrderValue)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-semibold text-gray-700">
                          Latest delivery address
                        </p>
                        {customer.latestAddress ? (
                          <p className="mt-1 leading-6">
                            {customer.latestAddress.addressLine1}
                            {customer.latestAddress.addressLine2
                              ? `, ${customer.latestAddress.addressLine2}`
                              : ""}
                            <br />
                            {customer.latestAddress.city}
                            {customer.latestAddress.state
                              ? `, ${customer.latestAddress.state}`
                              : ""}
                            {customer.latestAddress.postalCode
                              ? ` - ${customer.latestAddress.postalCode}`
                              : ""}
                            <br />
                            {customer.latestAddress.country}
                          </p>
                        ) : (
                          <p className="mt-1">No address available</p>
                        )}
                      </div>

                      <p className="mt-4 text-xs text-gray-500">
                        Last order: {formatDate(customer.lastOrderAt)}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="mt-6 hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                        <th className="px-4 py-4 font-semibold">Customer</th>
                        <th className="px-4 py-4 font-semibold">Phone</th>
                        <th className="px-4 py-4 font-semibold">Orders</th>
                        <th className="px-4 py-4 font-semibold">
                          Order value
                        </th>
                        <th className="px-4 py-4 font-semibold">
                          Last order
                        </th>
                        <th className="px-4 py-4 font-semibold">
                          Latest order
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-gray-100 align-top last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-5">
                            <div className="font-semibold text-gray-950">
                              {customer.name || "Unnamed customer"}
                            </div>
                            <div className="mt-1 break-all text-gray-500">
                              {customer.email || "No email"}
                            </div>

                            {customer.latestAddress && (
                              <div className="mt-2 max-w-xs text-xs leading-5 text-gray-500">
                                {customer.latestAddress.addressLine1}
                                {customer.latestAddress.city
                                  ? `, ${customer.latestAddress.city}`
                                  : ""}
                                {customer.latestAddress.postalCode
                                  ? ` ${customer.latestAddress.postalCode}`
                                  : ""}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-5 text-gray-700">
                            {customer.phone || "—"}
                          </td>

                          <td className="px-4 py-5">
                            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                              {customer.orderCount}
                            </span>
                          </td>

                          <td className="px-4 py-5 font-semibold text-gray-950">
                            {formatPrice(customer.totalOrderValue)}
                          </td>

                          <td className="px-4 py-5 whitespace-nowrap text-gray-600">
                            {formatDate(customer.lastOrderAt)}
                          </td>

                          <td className="px-4 py-5 text-gray-600">
                            {customer.latestOrderNumber || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Showing up to 500 customers, ordered by most recent
                  activity. Order value excludes cancelled orders; it
                  does not necessarily represent collected payments.
                </p>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
