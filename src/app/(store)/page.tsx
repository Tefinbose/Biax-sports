import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
      <section className="relative isolate w-full max-w-full overflow-hidden bg-primary text-white">
        {/* Desktop diagonal black split shape (hidden on mobile so it doesn't slice through text) */}
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-full bg-neutral-950 [clip-path:polygon(62%_0,100%_0,100%_100%,42%_100%)] lg:block lg:w-[58%]" />
        {/* Mobile unified athletic gradient overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#d71920] via-[#c4141a] to-[#990d12] lg:hidden" />
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.05)_46px_48px)]" />
        <div className="absolute -bottom-40 -left-32 -z-10 h-[460px] w-[460px] rounded-full border border-white/20" />

        <div className="mx-auto grid max-w-[1440px] items-center gap-8 sm:gap-12 px-4 py-8 sm:px-8 sm:py-20 lg:grid-cols-12 lg:px-12 lg:py-24">
          <div className="w-full min-w-0 lg:col-span-7">
            <p className="mb-4 sm:mb-6 inline-flex items-center gap-2.5 rounded-full bg-black/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] backdrop-blur sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-white shrink-0" />
              BIAX SPORTS · India
            </p>

            <h1 className="text-[clamp(2.35rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.05em]">
              Built
              <br />
              for
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#ffffff] sm:[-webkit-text-stroke:2px_#ffffff]">
                impact.
              </span>
            </h1>

            <p className="mt-4 sm:mt-8 max-w-lg text-sm sm:text-lg leading-relaxed text-white/90">
              {siteConfig.tagline} Sportswear, martial arts uniforms and
              essential equipment designed to move with your ambition.
            </p>

            {/* Animated keyword ticker */}
            <div className="mt-4 sm:mt-6 w-full max-w-full overflow-hidden" aria-hidden="true">
              <div className="hero-ticker flex w-max gap-6 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
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

            <div className="relative z-10 mt-6 sm:mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
                className="group relative inline-flex min-h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full px-8 text-sm font-black uppercase tracking-wider shadow-xl shadow-black/25 transition-all duration-300 hover:bg-neutral-950 hover:!text-white active:scale-95"
              >
                <span style={{ color: "#0a0a0a" }} className="transition-colors group-hover:!text-white font-black">
                  Shop the collection
                </span>
                <ArrowUpRight
                  size={19}
                  style={{ color: "#0a0a0a" }}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:!text-white"
                />
              </Link>
              <Link
                href="#story"
                style={{ borderColor: "rgba(255, 255, 255, 0.7)", color: "#ffffff", backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                className="group inline-flex min-h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 px-8 text-sm font-black uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:bg-white hover:!text-neutral-950 active:scale-95"
              >
                <span style={{ color: "#ffffff" }} className="transition-colors group-hover:!text-neutral-950 font-black">
                  Our story
                </span>
                <ArrowRight
                  size={17}
                  style={{ color: "#ffffff" }}
                  className="transition-transform group-hover:translate-x-1 group-hover:!text-neutral-950"
                />
              </Link>
            </div>
          </div>

          {/* Logo showcase */}
          <div className="relative mx-auto flex w-full max-w-[340px] sm:max-w-[460px] items-center justify-center lg:col-span-5 pt-2 pb-6 sm:py-0 overflow-hidden sm:overflow-visible">
            <div className="absolute h-[240px] w-[240px] sm:h-[420px] sm:w-[420px] rounded-full border border-white/15" />
            <div className="absolute h-[190px] w-[190px] sm:h-[330px] sm:w-[330px] rounded-full border border-white/20" />
            <div className="absolute h-[150px] w-[150px] sm:h-[280px] sm:w-[280px] rounded-full bg-black/20 blur-2xl" />

            <div className="relative w-full max-w-[280px] sm:max-w-[360px] rotate-0 sm:rotate-[4deg] rounded-3xl sm:rounded-[2rem] bg-white p-6 sm:p-10 text-neutral-950 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-0">
              <div className="absolute -left-2 sm:-left-3 top-8 h-12 sm:h-14 w-2.5 sm:w-3 bg-primary" />
              <Image
                src="/images/logo.png"
                alt="BIAX SPORTS logo"
                width={600}
                height={225}
                priority
                className="h-auto w-full object-contain"
                sizes="(max-width: 640px) 75vw, 360px"
              />
              <div className="mt-4 sm:mt-6 border-t border-neutral-200 pt-3 sm:pt-4">
                <p className="text-lg sm:text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                  Train.
                  <span className="text-primary"> Rise.</span>
                  <br />
                  Repeat.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-2 sm:-bottom-3 left-4 sm:-left-2 rounded-2xl bg-white px-3.5 py-2 sm:px-5 sm:py-3 text-neutral-950 shadow-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Our mindset
              </p>
              <p className="text-xs sm:text-sm font-black">Discipline. Determination.</p>
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
      <div className="border-t border-neutral-200/60 bg-neutral-50">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-6 px-5 py-5 sm:gap-10 sm:px-8 lg:px-12">
          {[
            { icon: "🚚", text: "Free shipping across India" },
            { icon: "↩️", text: "7-day easy exchanges" },
            { icon: "🏆", text: "Tournament-grade quality" },
            { icon: "🇮🇳", text: "Proudly made for Indian athletes" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-base sm:text-lg" role="img" aria-hidden="true">{item.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-600 sm:text-xs">
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