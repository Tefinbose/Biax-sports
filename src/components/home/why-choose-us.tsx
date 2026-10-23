import {
  BadgeCheck,
  Gauge,
  HeadphonesIcon,
  RefreshCw,
  RotateCcw,
  Shield,
  Truck,
  Zap,
} from "lucide-react";

const usps = [
  {
    icon: <Truck strokeWidth={2} size={26} />,
    title: "Free Pan-India Shipping",
    desc: "Free delivery on all orders across India. No hidden charges, no minimum order.",
  },
  {
    icon: <RefreshCw strokeWidth={2} size={26} />,
    title: "7-Day Easy Exchanges",
    desc: "Wrong size? No problem. Hassle-free size exchanges within 7 days of delivery.",
  },
  {
    icon: <Gauge strokeWidth={2} size={26} />,
    title: "Performance-First Design",
    desc: "Every product is selected for athletes — tested for movement, durability and competition.",
  },
  {
    icon: <BadgeCheck strokeWidth={2} size={26} />,
    title: "Tournament-Grade Quality",
    desc: "Gis, uniforms and gear that meet the standards of national-level competitions.",
  },
  {
    icon: <Shield strokeWidth={2} size={26} />,
    title: "Secure Payments",
    desc: "100% safe and encrypted checkout. UPI, cards, net banking and COD accepted.",
  },
  {
    icon: <HeadphonesIcon strokeWidth={2} size={26} />,
    title: "Dedicated Support",
    desc: "Real humans based in Kerala ready to help with sizing, orders and bulk inquiries.",
  },
  {
    icon: <Zap strokeWidth={2} size={26} />,
    title: "Fast Dispatch",
    desc: "Orders placed before 5 PM are dispatched the same business day.",
  },
  {
    icon: <RotateCcw strokeWidth={2} size={26} />,
    title: "Bulk & Academy Orders",
    desc: "Custom embroidery and volume discounts for clubs, academies and sports schools.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden border-t border-neutral-200/80 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
              The BIAX Promise
            </p>
            <h2 className="text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-neutral-950 sm:text-5xl lg:text-6xl">
              Why athletes{" "}
              <span className="text-transparent [-webkit-text-stroke:1.8px_#d71920] sm:[-webkit-text-stroke:2.4px_#d71920]">
                choose us
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-neutral-500 sm:text-right">
            From first purchase to match day — we've got every step of your
            athletic journey covered.
          </p>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 gap-px bg-neutral-200/80 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((item, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-4 bg-white p-7 transition-colors duration-300 hover:bg-neutral-950 sm:p-8"
            >
              {/* Red left accent on hover */}
              <div className="absolute left-0 top-0 h-full w-[3px] origin-bottom scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />

              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                {item.icon}
              </span>

              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-neutral-950 transition-colors duration-300 group-hover:text-white sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-neutral-500 transition-colors duration-300 group-hover:text-neutral-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
