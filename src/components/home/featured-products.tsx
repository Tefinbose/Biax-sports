"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
} from "lucide-react";
import ProductCard, { type StoreProduct } from "@/components/products/product-card";

interface FeaturedProductsProps {
  products?: StoreProduct[];
}

// Fallback high-quality products matching BIAX's disciplines
const fallbackProducts: StoreProduct[] = [
  {
    name: "BIAX Performance Training T-Shirt",
    slug: "biax-performance-training-tshirt",
    category: "sportswear",
    price: 799,
    compareAtPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 50,
    featured: true,
    rating: 4.9,
    reviewCount: 48,
    bestSeller: true,
  },
  {
    name: "BIAX Martial Arts Training Gi",
    slug: "biax-martial-arts-training-uniform",
    category: "martial-arts-uniforms",
    price: 1499,
    compareAtPrice: 1799,
    images: [
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 25,
    featured: true,
    rating: 4.9,
    reviewCount: 62,
    bestSeller: true,
  },
  {
    name: "BIAX Athletic Training Wear",
    slug: "biax-athletic-training-wear",
    category: "sportswear",
    price: 1199,
    compareAtPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 35,
    featured: true,
    rating: 4.8,
    reviewCount: 34,
    bestSeller: false,
  },
  {
    name: "BIAX Combat Sparring Gloves",
    slug: "biax-combat-sports-gloves",
    category: "martial-arts-uniforms",
    price: 1299,
    compareAtPrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 20,
    featured: false,
    rating: 4.7,
    reviewCount: 29,
    bestSeller: true,
  },
  {
    name: "BIAX Training Football",
    slug: "biax-training-football",
    category: "sports-equipment",
    price: 899,
    compareAtPrice: 1199,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 40,
    featured: true,
    rating: 4.8,
    reviewCount: 41,
    bestSeller: true,
  },
  {
    name: "BIAX Heavy Duty Gym Duffle",
    slug: "biax-heavy-duty-duffle-bag",
    category: "sports-equipment",
    price: 1699,
    compareAtPrice: 2199,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 18,
    featured: true,
    rating: 4.9,
    reviewCount: 53,
    bestSeller: false,
  },
];

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "bestsellers">(
    "all",
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Use provided products from database, or fallback sample products if DB is empty
  const allItems = useMemo(() => {
    return products.length > 0 ? products : fallbackProducts;
  }, [products]);

  const filteredItems = useMemo(() => {
    if (activeTab === "featured") {
      const items = allItems.filter((p) => p.featured);
      return items.length > 0 ? items : allItems;
    }
    if (activeTab === "bestsellers") {
      const items = allItems.filter(
        (p) => p.bestSeller || (p.stock && p.stock > 0),
      );
      return items.length > 0 ? items : allItems;
    }
    return allItems;
  }, [allItems, activeTab]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredItems]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by roughly 1-2 card widths
    const cardWidth = el.querySelector("article")?.clientWidth ?? 300;
    const scrollAmount = (cardWidth + 20) * (window.innerWidth < 640 ? 1 : 2);

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleTabChange = (tab: "all" | "featured" | "bestsellers") => {
    setActiveTab(tab);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="border-t border-neutral-200/80 bg-white px-5 py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        {/* SECTION HEADER */}
        <div className="flex flex-col gap-3.5 border-b border-neutral-100 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-8">
          <div>
            <p className="mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Curated Gear · Handpicked
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase leading-[1.08] tracking-tight text-neutral-950">
              Featured &amp;{" "}
              <span className="text-transparent [-webkit-text-stroke:1.6px_#d71920] sm:[-webkit-text-stroke:2.4px_#d71920] transition-colors duration-300 hover:text-[#d71920]">
                Best-Sellers
              </span>
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-600 sm:text-sm sm:leading-6">
              Discover performance sportswear, tournament-tested martial arts gis,
              and athletic equipment designed for athletes who never settle.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-neutral-300/90 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 shadow-sm transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
          >
            <span>View All</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* TABS & CONTROLS ROW */}
        <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-between gap-3">
          {/* Filter Tabs (Horizontal scroll on mobile with edge-to-edge padding) */}
          <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "all"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950"
              }`}
            >
              All Picks ({allItems.length})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("featured")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "featured"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950"
              }`}
            >
              <Flame size={12} />
              Featured Gear
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("bestsellers")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "bestsellers"
                  ? "bg-neutral-950 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950"
              }`}
            >
              <TrendingUp size={12} />
              Best Sellers
            </button>
          </div>

          {/* Header Arrow Controls (visible on desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Slide previous products"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-neutral-900`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Slide next products"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-neutral-900`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* SINGLE ROW SLIDER CONTAINER WITH SIDE ARROWS (Hidden on mobile to avoid overlapping) */}
        <div className="group/slider relative mt-5 sm:mt-8">
          {/* Floating Left Arrow (desktop only) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Slide left"
            className={`absolute -left-3 sm:-left-5 top-1/2 z-30 hidden sm:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-xl backdrop-blur-md transition hover:scale-105 hover:border-primary hover:bg-primary hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0`}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Floating Right Arrow (desktop only) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Slide right"
            className={`absolute -right-3 sm:-right-5 top-1/2 z-30 hidden sm:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-xl backdrop-blur-md transition hover:scale-105 hover:border-primary hover:bg-primary hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-0`}
          >
            <ChevronRight size={22} />
          </button>

          {/* THE SINGLE SCROLLABLE ROW - Edge-to-edge padding on mobile */}
          <div
            ref={scrollRef}
            className="-mx-5 flex items-stretch gap-3 sm:gap-6 overflow-x-auto px-5 pb-4 pt-1 scroll-smooth snap-x snap-mandatory sm:mx-0 sm:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {filteredItems.map((product) => (
              <div
                key={product.slug}
                className="w-[205px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-none snap-start flex flex-col"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA LINK */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2.5 text-center sm:mt-14">
          <Link
            href="/shop"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition duration-300 hover:bg-primary hover:-translate-y-0.5 active:scale-95"
          >
            View All Products
            <ArrowUpRight size={15} />
          </Link>
          <p className="text-[11px] sm:text-xs text-neutral-500">
            Free shipping across India on qualifying orders · Easy 7-day size exchanges
          </p>
        </div>
      </div>
    </section>
  );
}
