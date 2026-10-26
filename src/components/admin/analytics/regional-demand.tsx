"use client";

import { MapPin } from "lucide-react";

interface StateDemandItem {
  state: string;
  orders: number;
  revenue: number;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RegionalDemand({ states }: { states: StateDemandItem[] }) {
  if (!states || states.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
          Geographic Demand
        </h3>
        <p className="mt-4 text-center text-xs text-neutral-400 py-8">
          Regional order data will populate as orders are placed across Indian states.
        </p>
      </div>
    );
  }

  const maxRev = Math.max(...states.map((s) => s.revenue), 1);
  const totalStateRev = states.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-primary">
              <MapPin size={15} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
                Top Regional Markets
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Highest performing Indian states by sales volume
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
            Pan-India
          </span>
        </div>

        {/* State Bars List */}
        <div className="mt-5 space-y-4">
          {states.map((item, idx) => {
            const widthPct = Math.max(8, Math.round((item.revenue / maxRev) * 100));
            const sharePct =
              totalStateRev > 0
                ? Math.round((item.revenue / totalStateRev) * 100)
                : 0;

            const isTop = idx === 0;

            return (
              <div key={item.state} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${
                        isTop
                          ? "bg-primary text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-neutral-900 truncate">
                      {item.state}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      ({item.orders} {item.orders === 1 ? "order" : "orders"})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 shrink-0">
                    <span className="font-black text-neutral-950">
                      {formatPrice(item.revenue)}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {sharePct}%
                    </span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    style={{ width: `${widthPct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop ? "bg-primary" : "bg-neutral-800 group-hover:bg-primary"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
