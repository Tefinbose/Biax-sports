import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Compass,
  Flame,
  MapPin,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about BIAX SPORTS INDIA PRIVATE LIMITED. Engineered for impact, empowering athletes and martial artists across India with premium sportswear and equipment.",
};

const pillars = [
  {
    number: "01",
    title: "Performance First",
    subtitle: "Built without shortcuts",
    description:
      "Every stitch, fabric blend, and seam is chosen to withstand relentless training sessions, rapid movements, and competition-level pressure.",
    icon: Target,
  },
  {
    number: "02",
    title: "Martial Arts Heritage",
    subtitle: "Discipline meets engineering",
    description:
      "Born from respect for martial arts traditions, our gis and uniforms meet strict standards of tear resistance, grip comfort, and tournament compliance.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Made For The Grind",
    subtitle: "Day in, day out durability",
    description:
      "Athletics is not defined by easy days. Our gear is tested to outlast sweat, chalk, friction, and washes so you can stay locked in on your goals.",
    icon: Flame,
  },
  {
    number: "04",
    title: "Indian Innovation",
    subtitle: "Pride in craftsmanship",
    description:
      "Headquartered in Kozhikode, Kerala, BIAX SPORTS is dedicated to delivering world-class sports gear to Indian athletes and academies at accessible pricing.",
    icon: Compass,
  },
];

const milestones = [
  { value: "100%", label: "Impact Focused", sub: "Designed for intensive physical training" },
  { value: "3", label: "Specialized Divisions", sub: "Sportswear, Martial Arts, and Equipment" },
  { value: "Kerala", label: "Headquartered", sub: "Kozhikode, India" },
  { value: "24/7", label: "Athletic Obsession", sub: "Driven by discipline and progress" },
];

const categoriesPreview = [
  {
    title: "Sportswear",
    slug: "sportswear",
    description:
      "Breathable, ergonomic tees, shorts, and activewear engineered for unrestricted motion.",
    image: "/images/sports-wear/image.jpg",
  },
  {
    title: "Martial Arts Uniforms",
    slug: "martial-arts-uniforms",
    description:
      "Reinforced uniforms and gis built for dojos, rings, and mats across all combat disciplines.",
    image: "/images/martial-arts/image.jpg",
  },
  {
    title: "Sports Equipment",
    slug: "sports-equipment",
    description:
      "Essential training accessories, gear bags, and protection to level up every workout session.",
    image: "/images/sports-equipments/pexels-mjrfilms-38593700.jpg",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Background Image: Athlete dedication and discipline */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1920&q=80"
            alt="BIAX athlete training with dedication and discipline"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.02)_46px_48px)]" />
        </div>

        <div className="pointer-events-none absolute -right-24 top-0 z-0 h-[460px] w-[460px] rounded-full bg-primary/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur sm:text-xs">
            Our Mission & Identity
          </div>

          <h1 className="mt-6 text-2xl font-black uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_#ffffff] sm:[-webkit-text-stroke:1.8px_#ffffff]">
              impact.
            </span>
            <br />
            Driven by{" "}
            <span className="text-primary">discipline.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base sm:leading-7">
            {siteConfig.legalName} was founded with a singular purpose: to give athletes,
            fighters, and fitness enthusiasts the high-performance gear they deserve without
            compromise.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95"
            >
              Explore Collection
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur transition hover:bg-white hover:text-neutral-950 active:scale-95"
            >
              Contact Our Team
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS / STATS */}
      <section className="border-y border-neutral-200 bg-neutral-50 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 md:grid-cols-4">
          {milestones.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
                {item.value}
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                {item.label}
              </span>
              <span className="mt-0.5 text-xs text-neutral-500">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STORY & PHILOSOPHY */}
      <section className="px-5 py-12 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
              Who We Are
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              From the mat to the podium, we equip the relentless.
            </h2>
            <div className="mt-5 space-y-3.5 text-sm leading-7 text-neutral-600">
              <p>
                At BIAX SPORTS, sport is not just leisure — it is a path to resilience, self-discovery,
                and mastery. Whether you are stepping onto a martial arts mat for combat sparring,
                powering through an endurance run, or lifting heavy in the gym, your gear should be
                an extension of your will.
              </p>
              <p>
                We noticed athletes were constantly forced to choose between overpriced foreign
                brands and subpar local equipment that frayed after a few rounds. We set out to change
                that by uniting premium materials, heavy-duty stitching, and ergonomic cuts specifically
                tailored for Indian athletes.
              </p>
              <p>
                From our origins in Kozhikode, Kerala, we have grown into a dedicated sports manufacturer
                and retailer trusted by fighters, trainers, and fitness communities.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-l-2 border-primary pl-4 text-neutral-900">
              <p className="text-sm font-bold italic sm:text-base">
                &ldquo;Every athlete has another level to reach. Our job is to give you the armor to get there.&rdquo;
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 shadow-2xl">
              <Image
                src="/images/martial-arts/image.jpg"
                alt="BIAX Martial Arts training"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7 sm:right-7">
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Heritage of Grit
                </span>
                <p className="mt-2 text-lg font-black uppercase tracking-tight sm:text-xl">
                  Forged in training. Proven in combat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="bg-neutral-950 px-5 py-12 text-white sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
                The BIAX Principles
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                What drives our craftsmanship.
              </h2>
            </div>
            <p className="max-w-md text-xs leading-6 text-neutral-400 sm:text-sm">
              Built by athletes, tested by practitioners. Every garment and item represents our
              four core values.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.number}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-neutral-900/60 p-6 transition duration-300 hover:border-primary hover:bg-neutral-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-white/20 transition group-hover:text-primary">
                        {pillar.number}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-primary transition group-hover:bg-primary group-hover:text-white">
                        <Icon size={18} />
                      </div>
                    </div>

                    <h3 className="mt-6 text-lg font-bold uppercase tracking-tight text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {pillar.subtitle}
                    </p>
                    <p className="mt-3 text-xs leading-6 text-neutral-400 sm:text-sm">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT DIVISIONS */}
      <section className="px-5 py-12 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
              What We Create
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Three Divisions of Excellence
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs text-neutral-600 sm:text-sm">
              Explore specialized product categories meticulously tailored for maximum comfort,
              aerodynamics, and resistance.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {categoriesPreview.map((cat, idx) => (
              <Link
                key={idx}
                href={`/categories/${cat.slug}`}
                className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 p-6 text-white transition hover:-translate-y-1 hover:shadow-xl sm:p-7"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Division 0{idx + 1}
                  </span>
                  <h3 className="mt-1 text-xl font-black uppercase tracking-tight sm:text-2xl">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-300">
                    {cat.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-primary">
                    Shop division
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE / LEGAL INFO */}
      <section className="border-t border-neutral-200 bg-neutral-100 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-7 sm:p-10 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
              <div className="lg:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Official Entity
                </span>
                <h3 className="mt-1 text-xl font-black uppercase text-neutral-950 sm:text-2xl">
                  {siteConfig.legalName}
                </h3>
                <p className="mt-2 text-xs leading-6 text-neutral-600 sm:text-sm">
                  Registered private limited company incorporated under the laws of India. Proudly
                  operating from Kozhikode, Kerala, dedicated to advancing sports culture and athlete
                  empowerment.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-neutral-700">
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5">
                    <MapPin size={15} className="text-primary" />
                    <span>
                      {siteConfig.address.city}, {siteConfig.address.state}, {siteConfig.address.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5">
                    <Award size={15} className="text-primary" />
                    <span>Athletic Quality Guaranteed</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 lg:items-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary"
                >
                  Reach Out to Us
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-xs font-medium text-neutral-500 hover:text-primary transition"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-primary px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.06)_46px_48px)]" />
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 sm:text-xs">
              Elevate Your Game
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight sm:text-3xl lg:text-4xl">
              Gear engineered for your next level.
            </h2>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">
              Explore uniforms, compression apparel, and athletic essentials today.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-950 shadow-xl transition hover:bg-neutral-950 hover:text-white"
          >
            Shop All Gear
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
