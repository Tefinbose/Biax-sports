import type { Metadata } from "next";
import { Suspense } from "react";
import NewArrivalsBanner from "@/components/home/new-arrivals-banner";
import ShopProductList from "@/components/products/shop-product-list";

export const metadata: Metadata = {
  title: "New Arrivals · Chase Greatness",
  description:
    "Explore the latest BIAX SPORTS new arrivals. Tournament-grade martial arts uniforms, combat sportswear, and athletic performance gear.",
};

function ProductListFallback() {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3.5"
        >
          <div className="aspect-square rounded-xl bg-neutral-100" />
          <div className="mt-3 h-2.5 w-1/4 rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-3/4 rounded bg-neutral-200" />
          <div className="mt-2 h-3.5 w-1/3 rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

export default function NewArrivalsPage() {
  return (
    <main>
      {/* HERO BANNER CAROUSEL */}
      <NewArrivalsBanner />

      {/* CATALOG SECTION */}
      <section id="catalog" className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200/80 pb-5">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
              Latest Releases
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-neutral-950 sm:text-3xl">
              Fresh Off The Line
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-medium">
            Engineered for combat athletes, martial artists, and competitors.
          </p>
        </div>

        <Suspense fallback={<ProductListFallback />}>
          <ShopProductList />
        </Suspense>
      </section>
    </main>
  );
}
