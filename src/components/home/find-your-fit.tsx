"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryData {
  name: string;
  slug: string;
  description: string;
}

interface FindYourFitProps {
  categories: readonly CategoryData[];
}

const cardConfigs = [
  {
    bgVar: "var(--card-1-bg)",
    textVar: "var(--card-1-text)",
    btnBgVar: "var(--card-1-btn-bg)",
    btnTextVar: "var(--card-1-btn-text)",
    image: "/images/sports-wear/image.jpg",
    imagePosition: "object-[center_20%]",
    circularBtnClass: "bg-white text-neutral-950 hover:bg-neutral-100",
    tags: ["Compression", "Training Tees", "Track Shorts"],
  },
  {
    bgVar: "var(--card-2-bg)",
    textVar: "var(--card-2-text)",
    btnBgVar: "var(--card-2-btn-bg)",
    btnTextVar: "var(--card-2-btn-text)",
    image: "/images/martial-arts/image.jpg",
    imagePosition: "object-[center_18%]",
    circularBtnClass: "bg-white text-neutral-950 hover:bg-neutral-100",
    tags: ["Karate & Judo Gis", "Sparring Gloves", "Rank Belts"],
  },
  {
    bgVar: "var(--card-3-bg)",
    textVar: "var(--card-3-text)",
    btnBgVar: "var(--card-3-btn-bg)",
    btnTextVar: "var(--card-3-btn-text)",
    image: "/images/sports-equipments/pexels-mjrfilms-38593700.jpg",
    imagePosition: "object-[center_60%]",
    circularBtnClass: "bg-white text-neutral-950 hover:bg-neutral-100 shadow-sm",
    tags: ["Training Bags", "Match Footballs", "Protection Gear"],
  },
];

export default function FindYourFit({ categories }: FindYourFitProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.86;
    const current = Math.round(el.scrollLeft / cardWidth);
    setActiveMobileTab(Math.min(categories.length - 1, Math.max(0, current)));
  };

  const scrollToCategory = (idx: number) => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.86;
    el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
    setActiveMobileTab(idx);
  };

  return (
    <section className="find-your-fit-section px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <style jsx>{`
        .find-your-fit-section {
          --fit-bg: #f4f4f2;
          --card-1-bg: #0a0a0a;
          --card-1-text: #ffffff;
          --card-1-btn-bg: #d71920;
          --card-1-btn-text: #ffffff;

          --card-2-bg: #d71920;
          --card-2-text: #ffffff;
          --card-2-btn-bg: #0a0a0a;
          --card-2-btn-text: #ffffff;

          --card-3-bg: #eaeae8;
          --card-3-text: #0a0a0a;
          --card-3-btn-bg: #0a0a0a;
          --card-3-btn-text: #ffffff;

          background-color: var(--fit-bg);
        }

        /* Desktop expanding accordion */
        @media (min-width: 860px) {
          .accordion-container {
            display: flex;
            flex-direction: row;
            height: 540px;
            gap: 16px;
          }
          .accordion-card {
            transition: flex 0.45s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 28px;
            overflow: hidden;
            position: relative;
          }
          .accordion-card.is-open {
            flex: 4 1 0%;
          }
          .accordion-card.is-slim {
            flex: 1 1 0%;
            cursor: pointer;
          }
          .slim-title-vertical {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .accordion-card {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1440px]">
        {/* SECTION HEADER */}
        <div className="mb-6 sm:mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
              // Disciplines & Collections
            </p>
            <h2 className="mt-1 text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-neutral-950 sm:text-5xl lg:text-6xl">
              Find your{" "}
              <span className="text-transparent [-webkit-text-stroke:1.8px_#d71920] sm:[-webkit-text-stroke:2.4px_#d71920]">
                fit
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <p className="mb-1.5 text-xs text-neutral-600 sm:text-right sm:text-sm font-medium">
              Pick a discipline to preview the gear built for it.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 border-b-2 border-neutral-950 pb-0.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition-all duration-300 hover:border-[#D71920] hover:text-[#D71920]"
            >
              Explore all collections
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE VIEW (Screens < 860px): Tactile Segmented Swipe Deck */}
        {/* Zero layout shift, no jumping accordion, 100% user-friendly */}
        {/* ======================================================== */}
        <div className="block lg:hidden">
          {/* Quick Segmented Category Pills */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat, idx) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => scrollToCategory(idx)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  activeMobileTab === idx
                    ? "bg-neutral-950 text-white shadow-md shadow-neutral-950/20"
                    : "bg-white text-neutral-700 border border-neutral-200/80 hover:border-neutral-900"
                }`}
              >
                0{idx + 1} · {cat.name}
              </button>
            ))}
          </div>

          {/* Swipe Snap Track */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-2 scrollbar-none -mx-5 px-5"
          >
            {categories.map((category, index) => {
              const config = cardConfigs[index] ?? cardConfigs[0];
              const num = `0${index + 1}`;

              return (
                <article
                  key={category.slug}
                  className="group relative flex w-[86vw] max-w-[380px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-900/5 transition-all duration-300"
                >
                  {/* TOP: Dedicated Priority Visual Showcase (100% Opacity, Unobscured) */}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="relative block aspect-[4/3.3] w-full overflow-hidden bg-neutral-100"
                    aria-label={`View ${category.name} collection`}
                  >
                    <Image
                      src={config.image}
                      alt={category.name}
                      fill
                      priority={index === 0}
                      className={`object-cover ${config.imagePosition} transition-transform duration-700 group-hover:scale-105`}
                      sizes="(max-width: 768px) 86vw, 400px"
                    />

                    {/* Subtle top vignette strictly for badge contrast */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />

                    {/* Floating Discipline Badge */}
                    <div className="absolute left-3.5 top-3.5 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d71920]" />
                        {num} · {category.name}
                      </span>
                    </div>

                    {/* Floating Direct Arrow Button */}
                    <div className="absolute right-3.5 top-3.5 z-10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-950 shadow-md backdrop-blur-md transition-all hover:bg-neutral-950 hover:text-white group-hover:scale-105 active:scale-95">
                        <ArrowUpRight size={17} />
                      </div>
                    </div>
                  </Link>

                  {/* BOTTOM: Category Details & Action Zone */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      {/* Sub-discipline Pills */}
                      {config.tags && (
                        <div className="mb-2.5 flex flex-wrap gap-1.5">
                          {config.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Category Title */}
                      <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-950">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Full-width Direct Action Button */}
                    <div className="mt-5 pt-1">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:bg-[#d71920] active:scale-[0.98]"
                      >
                        <span>Shop {category.name}</span>
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Swipe Indicator Dots */}
          <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden="true">
            {categories.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToCategory(i)}
                aria-label={`View category ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeMobileTab === i ? "w-6 bg-primary" : "w-1.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP VIEW (Screens >= 860px): Horizontal Flex Accordion */}
        {/* Retains the expanding interactive experience on large screens */}
        {/* ======================================================== */}
        <div className="hidden lg:block">
          <div className="accordion-container">
            {categories.map((category, index) => {
              const isOpen = openIndex === index;
              const config = cardConfigs[index] ?? cardConfigs[0];
              const num = `0${index + 1}`;

              return (
                <div
                  key={category.slug}
                  className={`accordion-card ${isOpen ? "is-open" : "is-slim"}`}
                  style={{
                    backgroundColor: config.bgVar,
                    color: config.textVar,
                  }}
                >
                  {isOpen ? (
                    /* OPEN CARD */
                    <div className="flex h-full flex-row items-stretch gap-6 p-8">
                      {/* Content Column */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        {/* Top Row: Category label & circular link */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-[0.24em] opacity-80">
                            Category {num}
                          </span>
                          <Link
                            href={`/categories/${category.slug}`}
                            aria-label={`View ${category.name} collection`}
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 ${config.circularBtnClass}`}
                          >
                            <ArrowUpRight size={19} />
                          </Link>
                        </div>

                        {/* Middle: Title & description */}
                        <div className="my-auto py-4">
                          <h3 className="text-4xl lg:text-5xl font-black uppercase leading-tight tracking-[-0.04em]">
                            {category.name}
                          </h3>
                          <p className="mt-2.5 max-w-md text-sm leading-relaxed opacity-85">
                            {category.description}
                          </p>
                        </div>

                        {/* Bottom: Pill shop button */}
                        <div className="pt-2">
                          <Link
                            href={`/categories/${category.slug}`}
                            style={{
                              backgroundColor: config.btnBgVar,
                              color: config.btnTextVar,
                            }}
                            className="inline-flex w-auto items-center justify-center rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95"
                          >
                            Shop {category.name.toLowerCase()}
                          </Link>
                        </div>
                      </div>

                      {/* Image Column */}
                      <div className="relative flex-1 max-w-[48%] h-full min-h-full overflow-hidden rounded-2xl bg-black/10 shadow-lg group/img">
                        <Image
                          src={config.image}
                          alt={`${category.name} preview`}
                          fill
                          priority={index === 0}
                          className={`object-cover ${config.imagePosition} transition-transform duration-700 group-hover/img:scale-105`}
                          sizes="600px"
                        />
                        <div className="pointer-events-none absolute inset-0 animate-shimmer opacity-0 transition-opacity duration-500 group-hover/img:opacity-100" />
                      </div>
                    </div>
                  ) : (
                    /* SLIM ACCORDION TAB */
                    <button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      aria-label={`Expand category ${num}: ${category.name}`}
                      aria-expanded={false}
                      className="flex h-full w-full flex-col items-center justify-start gap-8 p-7 text-center transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                      style={{ color: config.textVar }}
                    >
                      <span className="text-2xl font-black tracking-tight">
                        {num}
                      </span>
                      <span className="slim-title-vertical text-center text-lg font-black uppercase tracking-[0.14em]">
                        {category.name}&nbsp;&nbsp;↗
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
