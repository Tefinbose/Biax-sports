"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiUsers, FiStar, FiLayers, FiTruck } from "react-icons/fi";

interface StatItem {
  index: string;
  target: number;
  suffix: string;
  isRating?: boolean;
  title: string;
  sub: string;
  icon: IconType;
}

const stats: StatItem[] = [
  {
    index: "01",
    target: 5000,
    suffix: "+",
    title: "Athletes Equipped",
    sub: "Across 28 States & Clubs",
    icon: FiUsers,
  },
  {
    index: "02",
    target: 49,
    suffix: "/5",
    isRating: true,
    title: "Tournament Rating",
    sub: "Tested under competition",
    icon: FiStar,
  },
  {
    index: "03",
    target: 120,
    suffix: "+",
    title: "Performance Designs",
    sub: "Gis, Sportswear & Kits",
    icon: FiLayers,
  },
  {
    index: "04",
    target: 100,
    suffix: "%",
    title: "Pan-India Logistics",
    sub: "Direct from Kerala Hub",
    icon: FiTruck,
  },
];

function AnimatedCounter({
  target,
  suffix,
  isRating,
  started,
}: {
  target: number;
  suffix: string;
  isRating?: boolean;
  started: boolean;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1600;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target]);

  if (isRating) {
    const display = (count / 10).toFixed(1);
    return (
      <span className="tabular-nums">
        {display}
        <span className="text-neutral-400 font-semibold text-xs sm:text-base">/5</span>
      </span>
    );
  }

  const formatted =
    target >= 1000
      ? count.toLocaleString("en-IN")
      : count.toString();

  return (
    <span className="tabular-nums">
      {formatted}
      <span className="text-primary font-black ml-0.5">{suffix}</span>
    </span>
  );
}

export default function BrandStatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Brand credentials and impact"
      className="relative z-10 border-b border-neutral-200/90 bg-[#fafafa]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-2 divide-y divide-neutral-200/80 sm:grid-cols-2 md:grid-cols-4 md:divide-y-0 md:divide-x">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className={`group relative flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 transition-colors duration-300 hover:bg-white ${
                  i % 2 === 1 ? "border-l border-neutral-200/80 md:border-l-0" : ""
                }`}
              >
                {/* Subtle athletic red accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Header: Icon + Index label */}
                <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-red-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="text-xs sm:text-base" />
                  </div>
                  <span className="hidden sm:inline font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
                    // {item.index}
                  </span>
                </div>

                {/* Number Stat */}
                <div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 font-sans leading-none sm:leading-tight">
                    <AnimatedCounter
                      target={item.target}
                      suffix={item.suffix}
                      isRating={item.isRating}
                      started={started}
                    />
                  </div>

                  {/* Primary Metric Name */}
                  <h3 className="mt-1 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-tight text-neutral-900 leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Context Subtitle */}
                <p className="mt-1 text-[9px] sm:text-[11px] text-neutral-500 font-medium leading-tight">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
