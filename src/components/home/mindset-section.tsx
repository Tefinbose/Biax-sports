import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    number: "01",
    title: ["PERFORMANCE", "FIRST"],
    description:
      "Thoughtfully selected sportswear and equipment for training, movement, and competition.",
    isLight: false,
  },
  {
    number: "02",
    title: ["MADE FOR THE", "GRIND"],
    description:
      "Comfort and durability for athletes who keep showing up and pushing forward.",
    isLight: true,
  },
  {
    number: "03",
    title: ["BUILT ON", "AMBITION"],
    description:
      "A sports brand driven by discipline, progress, and the spirit of every athlete.",
    isLight: false,
  },
];

export default function MindsetSection() {
  return (
    <section
      id="story"
      className="relative isolate overflow-hidden bg-[#0a0a0c] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      {/* Background Subtle Horizontal Speed Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(0deg,transparent_0_3px,rgba(255,255,255,0.02)_3px_4px)]" />

      {/* Red Angled Geometry on Desktop (Matches the athletic split cut) */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <svg
          className="h-full w-full"
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Darker red bevel shadow strip along the angle */}
          <polygon points="560,0 1000,0 1000,800 445,800" fill="#930b11" />
          {/* Main vibrant athletic red polygon */}
          <polygon points="590,0 1000,0 1000,800 472,800" fill="#d71920" />
        </svg>
      </div>

      {/* Mobile Red Dynamic Backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0 block md:hidden">
        <svg
          className="h-full w-full"
          viewBox="0 0 1000 1200"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,320 1000,240 1000,1200 0,1200" fill="#930b11" />
          <polygon points="0,340 1000,260 1000,1200 0,1200" fill="#d71920" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Top Header & Right Side Description */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-end">
          {/* Left Column: Tag and Giant Italic Heading */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Tag: >>> THE BIAX STANDARD */}
            <div className="mb-4 sm:mb-6 flex items-center gap-2">
              <div className="flex items-center -space-x-1 text-white">
                <svg
                  className="h-3.5 w-3.5 stroke-[3.5] fill-none stroke-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
                <svg
                  className="h-3.5 w-3.5 stroke-[3.5] fill-none stroke-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
                <svg
                  className="h-3.5 w-3.5 stroke-[3.5] fill-none stroke-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-white">
                The Biax Standard
              </span>
            </div>

            {/* Giant 3-Line Italic Header */}
            <h2 className="font-black italic uppercase leading-[0.88] tracking-[-0.04em] text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px]">
              <span className="block text-white">More Than</span>
              <span className="block text-white">Gear.</span>
              <span className="block text-transparent [-webkit-text-stroke:1.8px_#ffffff] sm:[-webkit-text-stroke:2.4px_#ffffff] lg:[-webkit-text-stroke:3px_#ffffff]">
                A Mindset.
              </span>
            </h2>
          </div>

          {/* Right Column: Copy & Slanted Parallelogram Button */}
          <div className="flex flex-col justify-end lg:col-span-5 xl:col-span-5 lg:pl-6 xl:pl-10">
            <p className="max-w-lg text-sm sm:text-base leading-relaxed sm:leading-7 text-white font-medium">
              At BIAX SPORTS, we believe every athlete has another level to
              reach. Our mission is to support that journey with reliable,
              performance-focused sportswear and equipment.
            </p>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center -skew-x-[14deg] bg-white px-7 py-3.5 sm:px-8 sm:py-4 transition-all duration-300 hover:bg-neutral-950"
              >
                <span className="inline-flex items-center gap-2.5 skew-x-[14deg] text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-colors duration-300 group-hover:text-white">
                  Discover BIAX SPORTS
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Pillars / Values Cards */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {cards.map((item) => (
            <article
              key={item.number}
              className={`p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                item.isLight
                  ? "bg-white text-neutral-950 shadow-2xl"
                  : "bg-[#111215] text-white"
              }`}
            >
              <div>
                <span className="block text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter text-[#d71920]">
                  {item.number}
                </span>

                <h3
                  className={`mt-6 sm:mt-8 text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight ${
                    item.isLight ? "text-neutral-950" : "text-white"
                  }`}
                >
                  {item.title[0]}
                  <br />
                  {item.title[1]}
                </h3>

                <p
                  className={`mt-4 text-xs sm:text-sm leading-relaxed ${
                    item.isLight
                      ? "text-neutral-700 font-medium"
                      : "text-neutral-400"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
