"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PromisePillar {
  index: string;
  tag: string;
  title: string;
  description: string;
  highlight: string;
}

const pillars: PromisePillar[] = [
  {
    index: "01",
    tag: "ENGINEERING",
    title: "Tournament-Grade Craft",
    description:
      "Every gi, activewear piece, and training kit meets national competition standards for tear-resistance, unrestricted mobility, and longevity.",
    highlight: "National Competition Compliant",
  },
  {
    index: "02",
    tag: "FIT ASSURANCE",
    title: "7-Day Zero-Risk Exchanges",
    description:
      "Wrong size? Exchange your items with doorstep reverse pickup within 7 days. Never compromise on comfort, reach, or combat range.",
    highlight: "Doorstep Pickup Across India",
  },
  {
    index: "03",
    tag: "LOGISTICS",
    title: "Pan-India Direct Dispatch",
    description:
      "Orders dispatched within 24 hours directly from our Kozhikode logistics hub. Fast, secure courier delivery across 19,000+ PIN codes.",
    highlight: "Free Shipping On All Orders",
  },
];

export default function WhyChooseUs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.82;
    const current = Math.round(el.scrollLeft / cardWidth);
    setActiveSlide(Math.min(pillars.length - 1, Math.max(0, current)));
  };

  const scrollToSlide = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.82;
    el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
    setActiveSlide(idx);
  };

  return (
    <section className="relative overflow-hidden border-t border-neutral-200/80 bg-white py-10 sm:py-16 lg:py-20">
      {/* Background Architectural Grid Accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Compact Header: Single line on desktop, clean on mobile */}
        <div className="mb-6 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-100 pb-5">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
              The BIAX Commitment
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Why Athletes{" "}
              <span className="text-primary">
                Choose Us
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-neutral-500 max-w-xs hidden md:block">
              Engineered for Indian athletes, fighters, and fitness competitors.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:text-primary"
            >
              <span>Our Standards</span>
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 3 Pillars: Horizontal Snap-Swiper on Mobile, Clean 3-Column Row on Desktop */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible"
        >
          {pillars.map((pillar) => (
            <article
              key={pillar.index}
              className="group relative flex w-[84vw] shrink-0 snap-center flex-col justify-between rounded-2xl border border-neutral-200/90 bg-[#fafafa] p-5 sm:w-auto sm:p-6 transition-all duration-300 hover:border-neutral-950 hover:bg-white hover:shadow-lg hover:shadow-black/5"
            >
              {/* Red hairline indicator */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div>
                {/* Micro Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {pillar.tag}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 group-hover:bg-primary transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950 group-hover:text-primary transition-colors leading-snug">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-600 font-medium">
                  {pillar.description}
                </p>
              </div>

              {/* Bottom Tag / Highlight */}
              <div className="mt-5 pt-3.5 border-t border-neutral-200/60 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 transition-colors">
                  {pillar.highlight}
                </span>
                <span className="text-xs text-neutral-300 group-hover:text-primary transition-colors font-mono">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Swipe Pagination Dots (Only visible on small screens) */}
        <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden" aria-hidden="true">
          {pillars.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeSlide === i ? "w-6 bg-primary" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
