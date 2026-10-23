"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  index: string;
  target: number;
  suffix: string;
  isRating?: boolean;
  title: string;
  sub: string;
}

const stats: StatItem[] = [
  {
    index: "01",
    target: 5000,
    suffix: "+",
    title: "Athletes Equipped",
    sub: "Across 28 States & Clubs",
  },
  {
    index: "02",
    target: 49,
    suffix: "/5",
    isRating: true,
    title: "Tournament Rating",
    sub: "Tested under competition",
  },
  {
    index: "03",
    target: 120,
    suffix: "+",
    title: "Performance Designs",
    sub: "Gis, Sportswear & Kits",
  },
  {
    index: "04",
    target: 100,
    suffix: "%",
    title: "Pan-India Logistics",
    sub: "Direct from Kerala Hub",
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
        <span className="text-neutral-400 font-semibold text-base sm:text-lg">/5</span>
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
          {stats.map((item, i) => (
            <div
              key={item.index}
              className={`group relative flex flex-col justify-between p-5 sm:p-7 lg:p-9 transition-colors duration-300 hover:bg-white ${
                i % 2 === 1 ? "border-l border-neutral-200/80 md:border-l-0" : ""
              }`}
            >
              {/* Subtle athletic red accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Header: Editorial Index Label (No cheesy icons) */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
                  // {item.index}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 transition-colors duration-300 group-hover:bg-primary" />
              </div>

              {/* Number Stat */}
              <div className="my-auto">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 font-sans">
                  <AnimatedCounter
                    target={item.target}
                    suffix={item.suffix}
                    isRating={item.isRating}
                    started={started}
                  />
                </div>

                {/* Primary Metric Name */}
                <h3 className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-black uppercase tracking-tight text-neutral-900">
                  {item.title}
                </h3>
              </div>

              {/* Editorial Context Subtitle */}
              <p className="mt-2 text-[10px] sm:text-xs text-neutral-500 font-medium leading-tight">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
