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
        <span className="text-neutral-400 font-semibold text-[9px] sm:text-xs md:text-base">/5</span>
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
        <div className="grid grid-cols-4 divide-x divide-neutral-200/80">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.index}
                className="group relative flex flex-col justify-between p-2.5 sm:p-5 lg:p-8 transition-colors duration-300 hover:bg-white min-w-0"
              >
                {/* Header: Icon */}
                <div className="mb-2 sm:mb-3 lg:mb-4">
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-red-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="text-[11px] sm:text-sm lg:text-base" />
                  </div>
                </div>

                {/* Number Stat */}
                <div>
                  <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 font-sans leading-none sm:leading-tight">
                    <AnimatedCounter
                      target={item.target}
                      suffix={item.suffix}
                      isRating={item.isRating}
                      started={started}
                    />
                  </div>

                  {/* Primary Metric Name */}
                  <h3 className="mt-1 text-[9px] sm:text-xs md:text-sm font-black uppercase tracking-tight text-neutral-900 leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Context Subtitle */}
                <p className="mt-1 text-[8px] sm:text-[10px] lg:text-[11px] text-neutral-500 font-medium leading-tight">
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
