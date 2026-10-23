
import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import ShopProductList from "@/components/products/shop-product-list";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Explore BIAX SPORTS sportswear, martial arts uniforms, and sports equipment.",
};

function ProductListFallback() {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3.5">
          <div className="aspect-square rounded-xl bg-neutral-100" />
          <div className="mt-3 h-2.5 w-1/4 rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-neutral-200" />
          <div className="mt-2 h-3.5 w-1/3 rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      {/* SHOP HEADER */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Background image matching shop collection with dark overlay for readability */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
            alt="BIAX sports training collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.02)_46px_48px)]" />
        </div>

        {/* athletic primary glow */}
        <div className="pointer-events-none absolute -right-24 top-0 z-0 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <p className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur sm:text-xs">
            BIAX SPORTS · Collection
          </p>

          <h1 className="text-2xl font-black uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Shop all{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_#ffffff] sm:[-webkit-text-stroke:1.8px_#ffffff]">
              products.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
            Explore performance-focused sportswear, martial arts uniforms, and
            essential sports equipment designed to support your journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/categories/sportswear"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur transition duration-300 hover:border-white hover:bg-white hover:text-neutral-950"
            >
              Sportswear
            </Link>

            <Link
              href="/categories/martial-arts-uniforms"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur transition duration-300 hover:border-white hover:bg-white hover:text-neutral-950"
            >
              Martial Arts
            </Link>

            <Link
              href="/categories/sports-equipment"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur transition duration-300 hover:border-white hover:bg-white hover:text-neutral-950"
            >
              Sports Equipment
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto min-h-[400px] max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <Suspense fallback={<ProductListFallback />}>
          <ShopProductList />
        </Suspense>
      </section>
    </>
  );
}
