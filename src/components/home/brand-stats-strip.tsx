import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Flame, Layers, Truck } from "lucide-react";

interface BrandPillar {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const pillars: BrandPillar[] = [
  {
    id: "craft",
    tag: "QUALITY",
    title: "Competition Quality",
    description: "Tough, tear-resistant gear built for hard daily training.",
    icon: ShieldCheck,
  },
  {
    id: "ergonomics",
    tag: "FIT",
    title: "Made To Move",
    description: "Comfortable athletic fit with complete freedom of movement.",
    icon: Flame,
  },
  {
    id: "range",
    tag: "PRODUCTS",
    title: "Sportswear & Fight Gear",
    description: "Martial arts uniforms, activewear, and training essentials.",
    icon: Layers,
  },
  {
    id: "logistics",
    tag: "DELIVERY",
    title: "Fast All-India Shipping",
    description: "Quick, reliable doorstep delivery anywhere across India.",
    icon: Truck,
  },
];

export default function BrandStatsStrip() {
  return (
    <section
      aria-label="Brand credentials and standards"
      className="relative z-10 border-b border-neutral-200/90 bg-[#fafafa]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-2 divide-y divide-neutral-200/80 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            const isOddColMobile = idx % 2 === 1;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between p-4 sm:p-6 lg:p-7 transition-colors duration-200 hover:bg-white min-w-0 ${
                  isOddColMobile ? "border-l border-neutral-200/80 lg:border-l-0" : ""
                }`}
              >
                {/* Athletic red accent top line on hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />

                {/* Top Row: Icon + Micro Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 transition-colors duration-200 group-hover:bg-primary group-hover:text-white shrink-0">
                    <Icon size={17} strokeWidth={2.2} />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-primary transition-colors">
                    {item.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-black uppercase tracking-tight text-neutral-950 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
