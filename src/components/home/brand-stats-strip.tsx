"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Star, Truck, Users } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  suffix?: string;
  label: string;
  target: number;
}

const stats: Stat[] = [
  {
    icon: <Users size={22} strokeWidth={2.5} />,
    value: "0",
    suffix: "+",
    label: "Athletes Equipped",
    target: 5000,
  },
  {
    icon: <Star size={22} strokeWidth={2.5} className="fill-amber-400 text-amber-400" />,
    value: "0",
    suffix: "/5",
    label: "Average Rating",
    target: 49,
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={2.5} />,
    value: "0",
    suffix: "+",
    label: "Products Available",
    target: 120,
  },
  {
    icon: <Truck size={22} strokeWidth={2.5} />,
    value: "0",
    suffix: "",
    label: "Pan-India Shipping",
    target: 100,
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
    const duration = 1800;
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
      <span>
        {display}
        {suffix}
      </span>
    );
  }

  const display =
    target >= 1000 ? `${Math.round(count / 100) / 10}K` : `${count}%`;

  return (
    <span>
      {target >= 100 && target < 1000 ? count + suffix : display}
      {target >= 1000 ? suffix : ""}
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
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-10 border-y border-neutral-200/80 bg-white"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`group flex flex-col items-center justify-center gap-1.5 px-3 py-5 text-center transition-colors duration-300 hover:bg-neutral-50 sm:gap-2.5 sm:px-6 sm:py-10 ${
              i % 2 === 0 ? "border-r border-neutral-200/80" : ""
            } ${i < 2 ? "border-b border-neutral-200/80 md:border-b-0" : ""} ${
              i > 0 ? "md:border-l md:border-neutral-200/80" : ""
            }`}
          >
            <span className="text-primary transition-transform duration-300 group-hover:scale-110">
              {stat.icon}
            </span>
            <p className="text-2xl font-black tracking-tight text-neutral-950 sm:text-4xl">
              <AnimatedCounter
                target={stat.target}
                suffix={stat.suffix ?? ""}
                isRating={i === 1}
                started={started}
              />
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
