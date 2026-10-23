import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import FindYourFit from "@/components/home/find-your-fit";
import FeaturedProducts from "@/components/home/featured-products";
import TestimonialsMarquee from "@/components/home/testimonials-marquee";
import MindsetSection from "@/components/home/mindset-section";
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
      .select(
        "name slug shortDescription category price compareAtPrice images stock featured",
      )
      .sort({ featured: -1, createdAt: -1 })
      .limit(8)
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
      images: product.images ?? [],
      stock: product.stock,
      featured: product.featured,
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
      <section className="relative isolate overflow-hidden bg-primary text-white">
        {/* diagonal black shape + stripes (pure CSS) */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full bg-neutral-950 [clip-path:polygon(62%_0,100%_0,100%_100%,42%_100%)] lg:w-[58%]" />
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.05)_46px_48px)]" />
        <div className="absolute -bottom-40 -left-32 -z-10 h-[460px] w-[460px] rounded-full border border-white/20" />

        <div className="mx-auto grid min-h-[560px] sm:min-h-[640px] max-w-[1440px] items-center gap-10 sm:gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-12 lg:px-12 lg:py-24">
          <div className="lg:col-span-7">
            <p className="mb-5 sm:mb-6 inline-flex items-center gap-3 rounded-full bg-black/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] backdrop-blur sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-white" />
              BIAX SPORTS · India
            </p>

            <h1 className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]">
              Built
              <br />
              for
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#ffffff] sm:[-webkit-text-stroke:2px_#ffffff]">
                impact.
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-lg text-sm sm:text-lg leading-6 sm:leading-8 text-white/85">
              {siteConfig.tagline} Sportswear, martial arts uniforms and
              essential equipment designed to move with your ambition.
            </p>

            <div className="relative z-10 mt-8 sm:mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="group relative inline-flex min-h-14 items-center justify-center gap-4 rounded-full bg-white px-8 text-sm font-bold !text-neutral-950 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-950 hover:!text-white"
              >
                <span className="!text-neutral-950 transition-colors group-hover:!text-white">
                  Shop the collection
                </span>
                <ArrowUpRight
                  size={19}
                  className="!text-neutral-950 transition-transform transition-colors group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:!text-white"
                />
              </Link>
              <Link
                href="#story"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/50 px-8 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Our story
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Logo showcase */}
          <div className="relative mx-auto flex w-full max-w-[420px] sm:max-w-[460px] items-center justify-center lg:col-span-5 pt-4 pb-6 sm:py-0">
            <div className="absolute h-[280px] w-[280px] rounded-full border border-white/15 sm:h-[420px] sm:w-[420px]" />
            <div className="absolute h-[220px] w-[220px] rounded-full border border-primary/60 sm:h-[330px] sm:w-[330px]" />
            <div className="absolute h-[180px] w-[180px] rounded-full bg-primary/30 blur-3xl sm:h-[280px] sm:w-[280px]" />

            <div className="relative w-full max-w-[300px] sm:max-w-[360px] rotate-0 sm:rotate-[4deg] rounded-3xl sm:rounded-[2rem] bg-white p-6 sm:p-10 text-neutral-950 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-0">
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
              <div className="mt-5 sm:mt-6 border-t border-neutral-200 pt-4">
                <p className="text-xl sm:text-3xl font-black uppercase leading-[0.95] tracking-[-0.04em]">
                  Train.
                  <span className="text-primary"> Rise.</span>
                  <br />
                  Repeat.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-2 sm:-bottom-3 left-4 sm:-left-2 rounded-2xl bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-neutral-950 shadow-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Our mindset
              </p>
              <p className="text-xs sm:text-sm font-black">Discipline. Determination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FIND YOUR FIT ACCORDION */}
      <FindYourFit categories={siteConfig.categories} />

      {/* FEATURED & BEST-SELLING PRODUCTS */}
      <Suspense fallback={<FeaturedProducts products={[]} />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* MINDSET */}
      <MindsetSection />

      {/* TESTIMONIALS MARQUEE */}
      <TestimonialsMarquee />

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