"use client";

import { useState } from "react";
import { FiTrendingUp, FiBarChart2, FiCalendar, FiDollarSign } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa6";

export type SalesDay = {
  date: string;
  label: string;
  fullDate?: string;
  revenue: number;
  orders: number;
};

interface RevenueChartProps {
  data: SalesDay[];
  range: string;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RevenueChart({ data, range }: RevenueChartProps) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-sm text-neutral-400">
        No sales data recorded for this period.
      </div>
    );
  }

  const values = data.map((d) => (metric === "revenue" ? d.revenue : d.orders));
  const maxVal = Math.max(...values, metric === "revenue" ? 1000 : 5);
  const totalVal = values.reduce((sum, v) => sum + v, 0);
  const avgVal = Math.round(totalVal / Math.max(1, data.length));

  // Find peak day
  const peakIdx = values.indexOf(Math.max(...values));
  const peakDay = data[peakIdx];

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 260;
  const padLeft = 65;
  const padRight = 25;
  const padTop = 25;
  const padBottom = 40;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const points = data.map((item, idx) => {
    const val = metric === "revenue" ? item.revenue : item.orders;
    const x = padLeft + (idx / Math.max(1, data.length - 1)) * chartW;
    const y = padTop + chartH - (val / maxVal) * chartH;
    return { x, y, item, val, idx };
  });

  // Generate SVG path for line and area
  const linePath = points.reduce((path, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    // Smooth bezier curve control points
    const prev = points[idx - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${path} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    padTop + chartH
  } L ${points[0].x} ${padTop + chartH} Z`;

  // Y-axis grid ticks (4 intervals)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    pct,
    val: Math.round(maxVal * pct),
    y: padTop + chartH - pct * chartH,
  }));

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-sm">
      {/* Header with metric toggles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
              <FiBarChart2 className="text-sm" />
            </span>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950">
              Sales & Order Volume
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500 font-medium">
            Daily performance timeline over the selected {range.toUpperCase()} period.
          </p>
        </div>

        {/* Metric mode toggle button group */}
        <div className="flex items-center gap-1 rounded-xl bg-neutral-100 p-1 self-start sm:self-auto border border-neutral-200/60">
          <button
            type="button"
            onClick={() => {
              setMetric("revenue");
              setHoveredIdx(null);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              metric === "revenue"
                ? "bg-white text-neutral-950 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <FaRupeeSign className="text-[11px]" />
            <span>Revenue</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMetric("orders");
              setHoveredIdx(null);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              metric === "orders"
                ? "bg-white text-neutral-950 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <FiBarChart2 className="text-xs" />
            <span>Orders Count</span>
          </button>
        </div>
      </div>

      {/* Mini KPI banner for this chart */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl bg-neutral-50/80 p-3.5 border border-neutral-100">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Period Total
          </p>
          <p className="mt-0.5 text-sm sm:text-base font-black text-neutral-950">
            {metric === "revenue" ? formatPrice(totalVal) : `${totalVal} orders`}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Daily Average
          </p>
          <p className="mt-0.5 text-sm sm:text-base font-black text-neutral-950">
            {metric === "revenue" ? formatPrice(avgVal) : `${avgVal} / day`}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Peak Value
          </p>
          <p className="mt-0.5 text-sm sm:text-base font-black text-primary">
            {metric === "revenue"
              ? formatPrice(Math.max(...values))
              : `${Math.max(...values)} orders`}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Peak Date
          </p>
          <p className="mt-0.5 text-sm sm:text-base font-black text-neutral-700 truncate">
            {peakDay ? peakDay.label : "—"}
          </p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative mt-6 w-full select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d71920" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#d71920" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#d71920" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-axis labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={svgWidth - padRight}
                y2={tick.y}
                stroke="#e5e5e5"
                strokeDasharray={tick.pct === 0 ? "none" : "3 3"}
                strokeWidth={tick.pct === 0 ? 1.5 : 1}
              />
              <text
                x={padLeft - 10}
                y={tick.y + 3.5}
                textAnchor="end"
                className="fill-neutral-400 text-[10px] font-mono font-medium"
              >
                {metric === "revenue"
                  ? tick.val >= 1000
                    ? `₹${(tick.val / 1000).toFixed(0)}k`
                    : `₹${tick.val}`
                  : tick.val}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Main Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#d71920"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Vertical Crosshair */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padTop}
                x2={activePoint.x}
                y2={padTop + chartH}
                stroke="#d71920"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                className="fill-white stroke-primary"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible hover touch zones for each point */}
          {points.map((pt) => {
            const stepW = chartW / Math.max(1, data.length - 1);
            return (
              <rect
                key={pt.idx}
                x={pt.x - stepW / 2}
                y={padTop}
                width={stepW}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(pt.idx)}
                onTouchStart={() => setHoveredIdx(pt.idx)}
              />
            );
          })}

          {/* X-axis tick labels */}
          {points.map((pt, i) => {
            // In 30d/90d mode, space labels to prevent overlapping
            const step = data.length > 30 ? 7 : data.length > 14 ? 3 : 1;
            const shouldShow = i % step === 0 || i === data.length - 1;
            if (!shouldShow) return null;

            return (
              <text
                key={i}
                x={pt.x}
                y={padTop + chartH + 20}
                textAnchor="middle"
                className="fill-neutral-500 text-[10px] font-mono font-medium"
              >
                {pt.item.label}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 -top-2 flex flex-col rounded-xl border border-neutral-200 bg-neutral-950 p-3 text-white shadow-xl text-xs transition-transform"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              transform: `translate(${activePoint.x > svgWidth * 0.7 ? "-100%" : "0%"}, -100%)`,
            }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400">
              <FiCalendar size={11} />
              <span>{activePoint.item.fullDate || activePoint.item.label}</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-sm font-black text-white">
                {formatPrice(activePoint.item.revenue)}
              </span>
              <span className="text-[11px] font-semibold text-neutral-300">
                ({activePoint.item.orders} {activePoint.item.orders === 1 ? "order" : "orders"})
              </span>
            </div>
            {activePoint.item.orders > 0 && (
              <p className="mt-1 text-[10px] text-neutral-400 font-mono">
                Avg: {formatPrice(activePoint.item.revenue / activePoint.item.orders)} / order
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
