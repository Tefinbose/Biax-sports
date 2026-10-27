"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ArrivalSlide {
  id: string;
  image: string;
  imageAlt: string;
  tag: string;
  headline: string;
  subheadline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  badge: string;
  objectPosition: string;
}

const defaultSlides: ArrivalSlide[] = [
  {
    id: "slide-combat",
    image: "/images/new-arrivals/new-arrival-combat.png",
    imageAlt: "BIAX Martial Arts & Combat Gis",
    tag: "#NewArrivals",
    headline: "CHASE GREATNESS",
    subheadline: "EARN EVERY REP",
    description:
      "Tournament-grade Karate, Judo, and BJJ Gis engineered for unrestricted mobility, tear resistance, and competition compliance.",
    ctaText: "SHOP MARTIAL ARTS",
    ctaHref: "/categories/martial-arts-uniforms",
    badge: "Tournament Compliant · Pearl Weave Cotton",
    objectPosition: "object-[75%_18%] sm:object-[72%_center] md:object-right",
  },
  {
    id: "slide-sportswear",
    image: "/images/new-arrivals/new-arrival-sportswear.png",
    imageAlt: "BIAX Performance Sportswear & Activewear",
    tag: "#NewArrivals",
    headline: "BUILT TO PERFORM",
    subheadline: "ENGINEERED TO MOVE",
    description:
      "High-compression training tees, breathable activewear, and athletic sets crafted for heavy lifting, conditioning, and everyday grind.",
    ctaText: "SHOP SPORTSWEAR",
    ctaHref: "/categories/sportswear",
    badge: "4-Way Stretch Compression · Moisture-Wicking",
    objectPosition: "object-[62%_18%] sm:object-[70%_center] md:object-right",
  },
  {
    id: "slide-equipment",
    image: "/images/new-arrivals/new-arrival-equipment.png",
    imageAlt: "BIAX Essential Sports Equipment & Gear",
    tag: "#NewArrivals",
    headline: "ELEVATE YOUR GAME",
    subheadline: "PRECISION TRAINING GEAR",
    description:
      "Pro dumbbells, match footballs, speed ropes, and rugged gym duffle bags designed to elevate every training session.",
    ctaText: "SHOP EQUIPMENT",
    ctaHref: "/categories/sports-equipment",
    badge: "Hex Dumbbells · Match Footballs · Heavy-Duty Duffles",
    objectPosition: "object-[50%_35%] sm:object-center",
  },
];

interface NewArrivalsBannerProps {
  slides?: ArrivalSlide[];
}

export default function NewArrivalsBanner({
  slides = defaultSlides,
}: NewArrivalsBannerProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer: cycles every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const active = slides[current];

  return (
    <section
      aria-label="New Arrivals Showcase"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group/carousel relative isolate overflow-hidden bg-neutral-950 pb-6 pt-24 sm:py-20 lg:py-24 text-white min-h-[520px] sm:min-h-[540px] lg:min-h-[600px] flex flex-col justify-end sm:justify-center select-none"
    >
      {/* BACKGROUND IMAGES (Smooth 700ms Crossfade) */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 -z-20 transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={idx === 0}
            sizes="100vw"
            className={`object-cover ${slide.objectPosition} select-none pointer-events-none`}
          />
        </div>
      ))}

      {/* GRADIENT OVERLAYS:
          - Desktop: Smooth left-to-right vignette so images are clearly visible on the right.
          - Mobile: Bottom-only gradient starting at 45% height, keeping the top 55% completely clear and bright for the models & gear.
      */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden sm:block bg-gradient-to-r from-neutral-950 via-neutral-950/85 via-45% to-transparent sm:via-neutral-950/75 sm:via-40% lg:via-neutral-950/65" />
      <div className="pointer-events-none absolute inset-0 -z-10 sm:hidden bg-gradient-to-t from-neutral-950 from-15% via-neutral-950/80 via-50% to-transparent" />

      {/* Subtle athletic red ambient glow blur on desktop */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 hidden sm:block h-72 w-72 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />

      {/* High-Tech Grid Accent (Desktop only to prevent mobile clutter) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden sm:block opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="max-w-xl sm:max-w-2xl">
          {/* Slide Content with key for smooth entry */}
          <div key={active.id} className="animate-fade-up">
            {/* Tag / Collection Badge */}
            <div className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 backdrop-blur-md border border-white/20">
              <span className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-neutral-200">
                {active.tag}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="mt-2 sm:mt-5 text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] sm:tracking-[-0.04em] text-white leading-[1.0] sm:leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              {active.headline}
            </h2>

            {/* Subheadline */}
            <p className="mt-1 sm:mt-4 text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] sm:tracking-[0.32em] text-neutral-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {active.subheadline}
            </p>

            {/* Narrative description (Desktop/Tablet only so mobile stays clean & visual) */}
            <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed hidden sm:block">
              {active.description}
            </p>

            {/* Styled Double Bracket Button (( SHOP NOW )) */}
            <div className="mt-3.5 sm:mt-8 flex items-center gap-4">
              <Link
                href={active.ctaHref}
                className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-white/60 bg-black/70 px-5 py-2.5 sm:px-7 sm:py-3 text-[11px] sm:text-sm font-black uppercase tracking-[0.22em] sm:tracking-[0.24em] text-white backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_0_30px_rgba(215,25,32,0.6)] active:scale-95"
              >
                <span className="font-mono text-sm sm:text-base text-neutral-400 group-hover:text-white transition-transform duration-300 group-hover:-translate-x-1">
                  ((
                </span>
                <span>{active.ctaText}</span>
                <span className="font-mono text-sm sm:text-base text-neutral-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1">
                  ))
                </span>
              </Link>
            </div>

            {/* Subtle Technical Spec Footnote */}
            <div className="mt-3.5 sm:mt-10 flex items-center text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-neutral-400">
              <span className="truncate">{active.badge}</span>
            </div>
          </div>
        </div>

        {/* CONTROLS & PAGINATION */}
        <div className="mt-4 sm:mt-10 flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-white/10">
          {/* Slide Indicator Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {slides.map((s, idx) => {
              const isCurrent = idx === current;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${s.headline}`}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 rounded-full py-1 px-2.5 sm:py-1.5 sm:px-3 transition-all duration-300 ${
                    isCurrent
                      ? "bg-white text-neutral-950 font-bold shadow-md shadow-white/20"
                      : "bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[10px] sm:text-xs">
                    0{idx + 1}
                  </span>
                  <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold">
                    {idx === 0 ? "Combat" : idx === 1 ? "Sportswear" : "Equipment"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:text-neutral-950 active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white hover:text-neutral-950 active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
