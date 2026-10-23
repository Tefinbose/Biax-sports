"use client";

import { CheckCircle2, Star } from "lucide-react";

export function GoogleOriginalIcon({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Google" fill="none">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

import { testimonials } from "@/data/testimonials";
export type { Testimonial } from "@/data/testimonials";

export default function TestimonialsMarquee() {
  // Duplicate array once for seamless infinite loop
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="relative isolate overflow-hidden border-t border-neutral-200/80 bg-neutral-50/60 py-14 sm:py-24 lg:py-28">
      {/* SECTION HEADER */}
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Aggregate rating stat */}
            <div className="mb-5 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 shadow-sm">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-neutral-900">4.9</span>
                <span className="text-[11px] font-semibold text-neutral-500">avg. rating</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm">
                <CheckCircle2 size={13} className="text-blue-500 shrink-0" />
                <span className="text-[11px] font-bold text-neutral-600">200+ Verified Google Reviews</span>
              </div>
            </div>

            <h2 className="text-[clamp(1.15rem,5.2vw,2.5rem)] font-black uppercase leading-tight tracking-tight text-neutral-950 whitespace-nowrap">
              Trusted by athletes{" "}
              <span className="text-transparent [-webkit-text-stroke:1.6px_#d71920] sm:[-webkit-text-stroke:2.4px_#d71920] transition-colors duration-300 hover:text-[#d71920]">
                across India
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* SINGLE ROW MARQUEE WITH HOVER PAUSE */}
      <div className="group/marquee relative mt-8 sm:mt-12 w-full overflow-hidden">
        {/* Left & Right gradient edge fades for smooth infinite look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-neutral-50/90 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-neutral-50/90 to-transparent sm:w-28" />

        {/* Marquee Track */}
        <div className="flex w-max gap-4 sm:gap-6 marquee-track group-hover/marquee:pause-marquee">
          {marqueeItems.map((item, idx) => (
            <article
              key={`${item.id}-${idx}`}
              className="flex w-[290px] shrink-0 flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:w-[380px] sm:p-7"
            >
              <div>
                {/* Header: User Info & Google Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-black text-white text-xs tracking-wider shadow-sm ring-2 ring-primary/20">
                      {item.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-neutral-950">{item.name}</h4>
                        <CheckCircle2 size={13} className="text-blue-500" />
                      </div>
                      <p className="text-[11px] font-semibold text-neutral-500 leading-tight">
                        {item.role}
                      </p>
                      <p className="text-[10px] text-neutral-400">{item.location}</p>
                    </div>
                  </div>

                  {/* Official Google Pill */}
                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 text-[11px] font-bold text-neutral-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                    <GoogleOriginalIcon className="h-3.5 w-3.5" />
                    <span className="text-[10px]">Google</span>
                  </div>
                </div>

                {/* Stars & Headline */}
                <div className="mt-4 flex items-center gap-1 text-[#FBBC05]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.date}
                  </span>
                </div>

                <h5 className="mt-3 text-sm font-black uppercase tracking-tight text-neutral-950 sm:text-base">
                  &ldquo;{item.headline}&rdquo;
                </h5>

                <p className="mt-2 text-xs leading-6 text-neutral-600 sm:text-sm sm:leading-6">
                  {item.content}
                </p>
              </div>

              {/* Card Footer: Verified Product Tag */}
              <div className="mt-5 border-t border-neutral-100 pt-3.5">
                <p className="text-[11px] font-medium text-neutral-500">
                  <span className="font-bold text-neutral-900">Verified Item:</span> {item.product}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Pure CSS Animation for Single-Row Seamless Loop with Hover Pause */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 42s linear infinite;
          will-change: transform;
        }

        .pause-marquee,
        .marquee-track:hover {
          animation-play-state: paused !important;
        }

        @media (max-width: 640px) {
          .marquee-track {
            animation-duration: 32s;
          }
        }
      `}</style>
    </section>
  );
}
