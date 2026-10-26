"use client";

import { CreditCard, Banknote, ShieldCheck } from "lucide-react";

interface PaymentMethodStat {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentDonut({
  methods,
}: {
  methods: PaymentMethodStat[];
}) {
  const online = methods.find((m) => m.method === "online") || {
    method: "online",
    count: 0,
    revenue: 0,
    percentage: 0,
  };

  const cod = methods.find((m) => m.method === "cod") || {
    method: "cod",
    count: 0,
    revenue: 0,
    percentage: 0,
  };

  const totalCount = online.count + cod.count;
  const totalRev = online.revenue + cod.revenue;

  // Donut geometry
  const size = 150;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const onlinePct = totalCount > 0 ? (online.count / totalCount) * 100 : 0;
  const onlineDash = (onlinePct / 100) * circumference;
  const codDash = circumference - onlineDash;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
              Payment Method Mix
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500 font-medium">
              COD vs Prepaid conversion share
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            {totalCount} Total
          </span>
        </div>

        {/* Circular Donut + Center Stat */}
        <div className="my-6 flex flex-col items-center justify-center sm:flex-row sm:gap-6">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90 transform">
              {/* Background Ring (COD) */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#d71920"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={`${codDash} ${circumference}`}
                strokeDashoffset={-onlineDash}
                className="transition-all duration-700"
              />
              {/* Foreground Ring (Online) */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#10b981"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={`${onlineDash} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Prepaid
              </span>
              <span className="text-xl font-black text-neutral-950">
                {Math.round(onlinePct)}%
              </span>
            </div>
          </div>

          {/* Quick Legend Pills */}
          <div className="mt-4 flex flex-row sm:flex-col gap-3 sm:mt-0">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-[#10b981]" />
              <div>
                <p className="text-[11px] font-bold text-neutral-800">Online UPI / Card</p>
                <p className="text-[10px] text-neutral-500 font-medium">{online.count} orders ({Math.round(onlinePct)}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-[#d71920]" />
              <div>
                <p className="text-[11px] font-bold text-neutral-800">Cash on Delivery</p>
                <p className="text-[10px] text-neutral-500 font-medium">{cod.count} orders ({100 - Math.round(onlinePct)}%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CreditCard size={14} />
            <span>Prepaid Total</span>
          </div>
          <p className="mt-2 text-base sm:text-lg font-black text-emerald-950">
            {formatPrice(online.revenue)}
          </p>
          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
            Avg: {online.count > 0 ? formatPrice(online.revenue / online.count) : "₹0"}
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5">
          <div className="flex items-center gap-1.5 text-red-800 text-xs font-bold uppercase tracking-wider">
            <Banknote size={14} />
            <span>COD Total</span>
          </div>
          <p className="mt-2 text-base sm:text-lg font-black text-red-950">
            {formatPrice(cod.revenue)}
          </p>
          <p className="text-[10px] text-red-700 font-medium mt-0.5">
            Avg: {cod.count > 0 ? formatPrice(cod.revenue / cod.count) : "₹0"}
          </p>
        </div>
      </div>
    </div>
  );
}
