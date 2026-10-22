"use client";

import { useState } from "react";
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
  },
  {
    bgVar: "var(--card-2-bg)",
    textVar: "var(--card-2-text)",
    btnBgVar: "var(--card-2-btn-bg)",
    btnTextVar: "var(--card-2-btn-text)",
    image: "/images/martial-arts/image.jpg",
    imagePosition: "object-[center_18%]",
    circularBtnClass: "bg-white text-neutral-950 hover:bg-neutral-100",
  },
  {
    bgVar: "var(--card-3-bg)",
    textVar: "var(--card-3-text)",
    btnBgVar: "var(--card-3-btn-bg)",
    btnTextVar: "var(--card-3-btn-text)",
    image: "/images/sports-equipments/pexels-mjrfilms-38593700.jpg",
    imagePosition: "object-[center_60%]",
    circularBtnClass: "bg-white text-neutral-950 hover:bg-neutral-100 shadow-sm",
  },
];

export default function FindYourFit({ categories }: FindYourFitProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="find-your-fit-section px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
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

        /* Desktop: 860px and above */
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

        /* Mobile: under 860px */
        @media (max-width: 859.98px) {
          .accordion-container {
            display: flex;
            flex-direction: column;
            gap: 14px;
            height: auto;
          }
          .accordion-card {
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            transition: height 0.45s ease;
            width: 100%;
          }
          .accordion-card.is-open {
            height: auto;
          }
          .accordion-card.is-slim {
            height: 68px;
            cursor: pointer;
          }
          .slim-title-vertical {
            writing-mode: horizontal-tb;
            transform: none;
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
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-neutral-950 sm:text-6xl lg:text-7xl">
            Find your{" "}
            <span className="text-transparent [-webkit-text-stroke:2px_#d71920] transition-colors duration-300 hover:text-[#d71920] sm:[-webkit-text-stroke:3px_#d71920]">
              fit
            </span>
          </h2>

          <div className="flex flex-col items-start sm:items-end">
            <p className="mb-2 text-xs font-semibold text-neutral-600 sm:text-right sm:text-sm">
              Pick a category to preview it, then jump straight in.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 border-b-2 border-neutral-950 pb-0.5 text-xs font-bold uppercase tracking-wider text-neutral-950 transition-all duration-300 hover:border-[#D71920] hover:text-[#D71920] hover:translate-x-1 sm:text-sm"
            >
              Explore all products
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* ACCORDION ROW */}
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
                  /* OPEN CARD (Split Layout: Text & Action on Left, Full Portrait Photo on Right without lines) */
                  <div className="flex h-full flex-col md:flex-row md:items-stretch gap-6 p-6 sm:p-8">
                    {/* Content Column */}
                    <div className="flex flex-1 flex-col justify-between order-2 md:order-1 min-w-0">
                      {/* Top Row: Category label & circular link */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] opacity-80">
                          Category {num}
                        </span>
                        <Link
                          href={`/categories/${category.slug}`}
                          aria-label={`View ${category.name} collection`}
                          className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 ${config.circularBtnClass}`}
                        >
                          <ArrowUpRight size={19} />
                        </Link>
                      </div>

                      {/* Middle: Title & description */}
                      <div className="my-auto py-4">
                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-[-0.04em]">
                          {category.name}
                        </h3>
                        <p className="mt-2.5 max-w-md text-xs leading-relaxed opacity-85 sm:text-sm">
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
                          className="inline-flex w-full sm:w-auto items-center justify-center rounded-full px-7 py-3.5 text-xs font-black uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95"
                        >
                          Shop {category.name.toLowerCase()}
                        </Link>
                      </div>
                    </div>

                    {/* Image Column: Clean, Crystal-Clear Photo without line overlay */}
                    <div className="relative flex-1 md:max-w-[46%] lg:max-w-[48%] h-64 sm:h-72 md:h-full min-h-[260px] md:min-h-full overflow-hidden rounded-2xl bg-black/10 order-1 md:order-2 shadow-lg">
                      <Image
                        src={config.image}
                        alt={`${category.name} preview`}
                        fill
                        priority={index === 0}
                        className={`object-cover ${config.imagePosition} transition-transform duration-700 hover:scale-105`}
                        sizes="(max-width: 860px) 100vw, 600px"
                      />
                    </div>
                  </div>
                ) : (
                  /* SLIM TAB */
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`Expand category ${num}: ${category.name}`}
                    aria-expanded={false}
                    className="flex h-full w-full items-center justify-between p-4 sm:p-7 text-left transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 md:flex-col md:items-center md:justify-start md:gap-8"
                    style={{ color: config.textVar }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 md:flex-col md:items-center md:gap-8">
                      {/* Number */}
                      <span className="text-lg font-black tracking-tight sm:text-2xl">
                        {num}
                      </span>

                      {/* Title */}
                      <span className="slim-title-vertical text-left md:text-center text-xs font-black uppercase tracking-[0.14em] sm:text-base md:text-lg">
                        {category.name}&nbsp;&nbsp;↗
                      </span>
                    </div>

                    {/* Mobile arrow indicator */}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 md:hidden">
                      <ArrowUpRight size={15} />
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
