
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  CirclePlus,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminLogoutButton from "@/components/admin/logout-button";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof ShoppingCart;
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
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-neutral-500">
        <span className="font-semibold text-neutral-700">
          {description}
        </span>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <AdminSidebar />

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-30 flex min-h-[88px] items-center justify-between gap-4 border-b border-neutral-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d71920]">
              Store management
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
          <section className="relative overflow-hidden rounded-3xl bg-[#171717] p-6 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-[#d71920]/20" />
            <div className="pointer-events-none absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-[#d71920]/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Admin workspace
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Welcome back to{" "}
                <span className="text-[#f0444b]">BIAX SPORTS.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
                Manage your products, monitor store activity, and keep your
                sports business running smoothly from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d71920] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <CirclePlus size={18} />
                  Manage products
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View storefront
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-neutral-900">
                  Store overview
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Your key business indicators at a glance.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600">
                <CalendarDays size={15} />
                All-time overview
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total revenue"
                value="—"
                description="Sales integration pending"
                icon={ChartNoAxesCombined}
              />

              <MetricCard
                title="Total orders"
                value="—"
                description="Order system pending"
                icon={ShoppingCart}
              />

              <MetricCard
                title="Products"
                value="—"
                description="Inventory summary pending"
                icon={Package}
              />

              <MetricCard
                title="Customers"
                value="—"
                description="Customer system pending"
                icon={Users}
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-neutral-900">
                    Sales performance
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Revenue trends will appear here.
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-[#d71920]">
                  <ChartNoAxesCombined size={21} />
                </div>
              </div>

              <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
                  <ChartNoAxesCombined size={23} />
                </div>
                <p className="mt-4 text-sm font-bold text-neutral-700">
                  Your sales chart will appear here
                </p>
                <p className="mt-2 max-w-sm text-xs leading-5 text-neutral-500">
                  This section can display daily revenue, order trends, and
                  sales comparisons after the order and payment systems are
                  connected.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-neutral-900">
                Quick actions
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Common store tasks.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/admin/products"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-[#d71920]">
                    <Package size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Manage products
                    </span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      Update your catalogue
                    </span>
                  </span>
                  <ArrowRight
                    size={17}
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]"
                  />
                </Link>

                <Link
                  href="/admin/orders"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <ShoppingCart size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      View orders
                    </span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      Order management
                    </span>
                  </span>
                  <ArrowRight
                    size={17}
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]"
                  />
                </Link>

                <Link
                  href="/admin/customers"
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <Users size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-neutral-800">
                      Customers
                    </span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      Customer management
                    </span>
                  </span>
                  <ArrowRight
                    size={17}
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-[#d71920]"
                  />
                </Link>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-neutral-900">
                  Recent orders
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Track your latest customer purchases.
                </p>
              </div>

              <span className="rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-500">
                Not connected yet
              </span>
            </div>

            <div className="mt-6 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
                <ShoppingCart size={21} />
              </div>
              <p className="mt-3 text-sm font-bold text-neutral-700">
                No order data to display yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Recent orders will show here when checkout is implemented.
              </p>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 py-5 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} BIAX SPORTS. All rights reserved.</p>
            <p className="font-semibold">BIAX SPORTS – Built for Impact</p>
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
          <p className="text-sm text-neutral-500">
            Loading your dashboard...
          </p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
