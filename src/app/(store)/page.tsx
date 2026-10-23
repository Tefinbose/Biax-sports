import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  TbTruckDelivery,
  TbArrowsExchange,
  TbTrophy,
  TbHeartHandshake,
} from "react-icons/tb";
import { siteConfig } from "@/config/site";
import FindYourFit from "@/components/home/find-your-fit";
import FeaturedProducts from "@/components/home/featured-products";
import WhyChooseUs from "@/components/home/why-choose-us";
import NewsletterSignup from "@/components/home/newsletter-signup";
import MindsetSection from "@/components/home/mindset-section";
import BrandStatsStrip from "@/components/home/brand-stats-strip";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import type { StoreProduct } from "@/components/products/product-card";

export const instant = false;

async function FeaturedProductsSection() {
  await connection();
  let products: StoreProduct[] = [];

  try {
    await connectToDatabase();
    const results = await Product.find({ published: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(12)
      .lean();

    products = results.map((product) => ({
      _id: String(product._id),
      id: String(product._id),
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: Array.isArray(product.images) ? product.images : [],
      stock: product.stock,
      featured: Boolean(product.featured),
      bestSeller: Boolean((product as unknown as Record<string, unknown>).bestSeller ?? (product.stock > 0)),
    }));
  } catch (error) {
    console.warn("Could not load products for HomePage from MongoDB:", error);
  }

  return <FeaturedProducts products={products} />;
}

export default function HomePage() {

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex w-full max-w-full items-center overflow-hidden bg-primary text-white lg:h-[calc(100vh-88px)] lg:min-h-[560px]">
        {/* Desktop diagonal black split shape (hidden on mobile so it doesn't slice through text) */}
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-full bg-neutral-950 [clip-path:polygon(62%_0,100%_0,100%_100%,42%_100%)] lg:block lg:w-[58%]" />
        {/* Mobile unified athletic gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#d71920] via-[#c4141a] to-[#990d12] lg:hidden" />
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.05)_46px_48px)]" />
        <div className="absolute -bottom-40 -left-32 -z-10 h-[460px] w-[460px] rounded-full border border-white/20" />

        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-6 px-4 py-8 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-4 xl:gap-12 xl:py-6">
          <div className="w-full min-w-0 lg:col-span-7">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] backdrop-blur sm:px-3.5 sm:text-xs xl:mb-4">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
              BIAX SPORTS · India
            </p>

            <h1 className="text-[clamp(2.35rem,5.2vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] xl:text-[clamp(2.8rem,5.8vw,5.25rem)]">
              Built
              <br />
              for
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#ffffff] sm:[-webkit-text-stroke:2px_#ffffff]">
                impact.
              </span>
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base xl:mt-5 xl:text-lg">
              {siteConfig.tagline} Sportswear, martial arts uniforms and
              essential equipment designed to move with your ambition.
            </p>

            {/* Animated keyword ticker */}
            <div className="mt-3 w-full max-w-full overflow-hidden xl:mt-5" aria-hidden="true">
              <div className="hero-ticker flex w-max gap-6 text-[10px] font-black uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
                {[
                  "Performance",
                  "•",
                  "Durability",
                  "•",
                  "Discipline",
                  "•",
                  "Ambition",
                  "•",
                  "Strength",
                  "•",
                  "Resilience",
                  "•",
                  "Performance",
                  "•",
                  "Durability",
                  "•",
                  "Discipline",
                  "•",
                  "Ambition",
                  "•",
                  "Strength",
                  "•",
                  "Resilience",
                  "•",
                ].map((word, i) => (
                  <span key={i} className={word === "•" ? "text-white/40" : ""}>
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-col gap-3 sm:flex-row xl:mt-7">
              <Link
                href="/shop"
                style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
                className="group relative inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-7 text-xs font-black uppercase tracking-wider shadow-xl shadow-black/25 transition-all duration-300 hover:bg-neutral-950 hover:!text-white active:scale-95 sm:w-auto xl:min-h-14 xl:px-8 xl:text-sm"
              >
                <span style={{ color: "#0a0a0a" }} className="font-black transition-colors group-hover:!text-white">
                  Shop the collection
                </span>
                <ArrowUpRight
                  size={18}
                  style={{ color: "#0a0a0a" }}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:!text-white"
                />
              </Link>
              <Link
                href="#story"
                style={{ borderColor: "rgba(255, 255, 255, 0.7)", color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border-2 px-7 text-xs font-black uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:bg-white hover:!text-neutral-950 active:scale-95 sm:w-auto xl:min-h-14 xl:px-8 xl:text-sm"
              >
                <span style={{ color: "#ffffff" }} className="font-black transition-colors group-hover:!text-neutral-950">
                  Our story
                </span>
                <ArrowRight
                  size={16}
                  style={{ color: "#ffffff" }}
                  className="transition-transform group-hover:translate-x-1 group-hover:!text-neutral-950"
                />
              </Link>
            </div>
          </div>

          {/* Logo showcase */}
          <div className="relative mx-auto flex w-full max-w-[320px] items-center justify-center overflow-hidden pb-6 pt-2 sm:max-w-[380px] sm:overflow-visible sm:py-0 lg:col-span-5 xl:max-w-[440px]">
            <div className="absolute h-[220px] w-[220px] rounded-full border border-white/15 sm:h-[340px] sm:w-[340px] xl:h-[420px] xl:w-[420px]" />
            <div className="absolute h-[180px] w-[180px] rounded-full border border-white/20 sm:h-[270px] sm:w-[270px] xl:h-[330px] xl:w-[330px]" />
            <div className="absolute h-[140px] w-[140px] rounded-full bg-black/20 blur-2xl sm:h-[220px] sm:w-[220px] xl:h-[280px] xl:w-[280px]" />

            <div className="relative w-full max-w-[260px] rotate-0 rounded-3xl bg-white p-5 text-neutral-950 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-0 sm:max-w-[320px] sm:rotate-[4deg] sm:rounded-[2rem] sm:p-7 xl:max-w-[360px] xl:p-9">
              <div className="absolute -left-2 top-7 h-10 w-2.5 bg-primary sm:-left-3 sm:top-8 sm:h-12 sm:w-3" />
              <Image
                src="/images/logo.png"
                alt="BIAX SPORTS logo"
                width={667}
                height={595}
                priority
                className="h-auto w-full object-contain"
                sizes="(max-width: 640px) 75vw, 360px"
              />
              <div className="mt-3.5 border-t border-neutral-200 pt-3 sm:mt-5 sm:pt-4">
                <p className="text-lg font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-2xl xl:text-3xl">
                  Train.
                  <span className="text-primary"> Rise.</span>
                  <br />
                  Repeat.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-2 left-4 rounded-2xl bg-white px-3.5 py-1.5 text-neutral-950 shadow-xl sm:-bottom-3 sm:-left-2 sm:px-4 sm:py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Our mindset
              </p>
              <p className="text-xs font-black sm:text-sm">Discipline. Determination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STATS STRIP */}
      <BrandStatsStrip />

      {/* FIND YOUR FIT ACCORDION */}
      <FindYourFit categories={siteConfig.categories} />

      {/* FEATURED & BEST-SELLING PRODUCTS */}
      <Suspense fallback={<FeaturedProducts products={[]} />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* MINDSET */}
      <MindsetSection />

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* NEWSLETTER */}
      <NewsletterSignup />

      {/* TRUST SIGNALS BAR */}
      <div className="border-t border-neutral-200/70 bg-neutral-50/90">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-6 px-5 py-4 sm:gap-10 sm:px-8 sm:py-5 lg:px-12">
          {[
            {
              icon: <TbTruckDelivery size={20} className="text-primary shrink-0" strokeWidth={2} />,
              text: "Free shipping across India",
            },
            {
              icon: <TbArrowsExchange size={20} className="text-primary shrink-0" strokeWidth={2} />,
              text: "7-day easy exchanges",
            },
            {
              icon: <TbTrophy size={19} className="text-primary shrink-0" strokeWidth={2} />,
              text: "Tournament-grade quality",
            },
            {
              icon: <TbHeartHandshake size={20} className="text-primary shrink-0" strokeWidth={2} />,
              text: "Proudly made for Indian athletes",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="shrink-0 flex items-center justify-center text-primary" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-700 sm:text-xs">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-primary px-5 py-14 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.06)_46px_48px)]" />
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 sm:mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 sm:text-xs">
              Your journey starts here
            </p>
            <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Ready to make
              <br />
              an impact?
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex min-h-14 sm:min-h-16 shrink-0 items-center justify-center gap-3 w-full sm:w-auto rounded-full bg-neutral-950 px-8 sm:px-10 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-neutral-950"
          >
            Shop BIAX SPORTS
            <ArrowUpRight
              size={19}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </>
  );
}