"use client";

import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";

interface StatusStat {
  status: string;
  count: number;
  revenue: number;
}

interface OrderPipelineProps {
  statuses: StatusStat[];
  totalOrders: number;
  fulfillmentRate: number;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Package }
> = {
  delivered: {
    label: "Delivered",
    color: "bg-emerald-500",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  shipped: {
    label: "In Transit / Shipped",
    color: "bg-blue-500",
    bg: "bg-blue-50 text-blue-800 border-blue-200",
    icon: Truck,
  },
  processing: {
    label: "Processing",
    color: "bg-indigo-500",
    bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    icon: Package,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-purple-500",
    bg: "bg-purple-50 text-purple-800 border-purple-200",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "bg-amber-500",
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    bg: "bg-red-50 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default function OrderPipeline({
  statuses,
  totalOrders,
  fulfillmentRate,
}: OrderPipelineProps) {
  const safeTotal = Math.max(1, totalOrders);

  // Order priority sequence
  const orderedKeys = ["delivered", "shipped", "processing", "confirmed", "pending", "cancelled"];

  const statusMap = new Map<string, StatusStat>();
  for (const s of statuses) {
    statusMap.set(s.status, s);
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
              Fulfillment Pipeline
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 font-medium">
              Order lifecycle and delivery conversion rate
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {fulfillmentRate}% Success
            </span>
          </div>
        </div>

        {/* Multi-segmented Pipeline Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mb-2">
            <span>Pipeline Distribution</span>
            <span>{totalOrders} Total Orders</span>
          </div>

          <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-neutral-100 p-0.5">
            {orderedKeys.map((key) => {
              const item = statusMap.get(key);
              if (!item || item.count === 0) return null;
              const pct = (item.count / safeTotal) * 100;
              const cfg = statusConfig[key] || {
                color: "bg-neutral-400",
                label: key,
              };

              return (
                <div
                  key={key}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                  className={`h-full first:rounded-l-full last:rounded-r-full ${cfg.color} transition-all`}
                  title={`${cfg.label}: ${item.count} orders (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>
        </div>

        {/* Status breakdown grid */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {orderedKeys.map((key) => {
            const item = statusMap.get(key) || { status: key, count: 0, revenue: 0 };
            const cfg = statusConfig[key];
            if (!cfg) return null;
            const Icon = cfg.icon;

            return (
              <Link
                key={key}
                href={`/admin/orders?status=${key}`}
                className={`group flex flex-col justify-between rounded-xl border p-3 transition hover:shadow-sm ${cfg.bg}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {cfg.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-lg font-black">{item.count}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {Math.round((item.count / safeTotal) * 100)}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
        <span>Click any status to jump directly to filtered orders.</span>
        <Link
          href="/admin/orders"
          className="font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          View all orders →
        </Link>
      </div>
    </div>
  );
}
