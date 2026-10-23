"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, RotateCcw, Star, Truck } from "lucide-react";
import type { StoreProduct } from "@/components/products/product-card";
import { isWishlisted, toggleWishlist } from "@/lib/wishlist";

interface FeaturedProductsProps {
  products?: StoreProduct[];
}

// Curated products matching the screenshot and brand disciplines
const fallbackProducts: StoreProduct[] = [
  {
    name: "BIAX Training Football",
    slug: "biax-training-football",
    category: "sports-equipment",
    price: 899,
    compareAtPrice: 1099,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
    ],
    stock: 40,
    featured: false,
    rating: 4.9,
    reviewCount: 82,
    bestSeller: true,
  },
  {
    name: "BIAX Martial Arts Training Uniform",
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
    reviewCount: 50,
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
    rating: 5.0,
    reviewCount: 17,
    bestSeller: false,
  },
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
    featured: false,
    rating: 4.8,
    reviewCount: 41,
    bestSeller: true,
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
    featured: true,
    rating: 4.7,
    reviewCount: 29,
    bestSeller: false,
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
    bestSeller: true,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatCategory(category: string) {
  if (category === "sports-equipment") return "Sports Equipment";
  if (category === "martial-arts-uniforms") return "Martial Arts Uniforms";
  if (category === "sportswear") return "Sportswear";
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function FeatureProductCard({ product }: { product: StoreProduct }) {
  const [wishlisted, setWishlisted] = useState(false);
  const productId = product._id ?? product.id ?? product.slug;

  const rawImg =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : "/images/sports-equipments/pexels-mjrfilms-38593700.jpg";

  const [imgSrc, setImgSrc] = useState(rawImg);

  useEffect(() => {
    setWishlisted(isWishlisted(productId));
    const handleUpdate = () => setWishlisted(isWishlisted(productId));
    window.addEventListener("biax-wishlist-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("biax-wishlist-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [productId]);

  useEffect(() => {
    if (product.images && product.images.length > 0 && product.images[0]) {
      setImgSrc(product.images[0]);
    } else {
      setImgSrc("/images/sports-equipments/pexels-mjrfilms-38593700.jpg");
    }
  }, [product.slug, product.images]);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const rating = product.rating ?? 4.9;
  const reviewCount = product.reviewCount ?? 45;

  return (
    <article className="group flex flex-col transition-all duration-300">
      {/* Product Image Box */}
      <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Link
          href={`/products/${encodeURIComponent(product.slug)}`}
          className="relative block h-full w-full"
        >
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            unoptimized={imgSrc.startsWith("http")}
            onError={() =>
              setImgSrc("/images/sports-equipments/pexels-mjrfilms-38593700.jpg")
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge (e.g. 18% OFF) */}
        {discountPercent > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-[#ff3b30] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const newState = toggleWishlist(productId);
            setWishlisted(newState);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            wishlisted
              ? "bg-white text-[#ff3b30] shadow-sm scale-105"
              : "bg-black/35 text-white/95 hover:bg-black/55 hover:text-white backdrop-blur-xs active:scale-95"
          }`}
        >
          <Heart
            size={14}
            strokeWidth={2}
            className={wishlisted ? "fill-[#ff3b30]" : ""}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col pt-2.5 sm:pt-3">
        {/* Category Pill */}
        <span className="self-start rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-neutral-600">
          {formatCategory(product.category)}
        </span>

        {/* Rating Row */}
        <div className="mt-1.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-neutral-600">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-neutral-800">{rating.toFixed(1)}</span>
          <span className="text-neutral-400">({reviewCount})</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${encodeURIComponent(product.slug)}`}
          className="mt-1 line-clamp-1 text-xs sm:text-sm font-bold text-neutral-900 transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-base font-bold text-neutral-950">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "bestsellers">(
    "all"
  );

  const allItems = useMemo(() => {
    return products.length > 0 ? products : fallbackProducts;
  }, [products]);

  // Provide distinct items per tab so clicking "Featured Gear" or "Best Sellers" changes the displayed products
  const displayedItems = useMemo(() => {
    if (activeTab === "featured") {
      // Prioritize tournament gear and uniforms for Featured Gear
      const feat = allItems.filter((p) => p.featured);
      const sorted = [...(feat.length >= 4 ? feat : allItems)].sort((a, b) => {
        const order: Record<string, number> = {
          "biax-combat-sports-gloves": 1,
          "biax-martial-arts-training-uniform": 2,
          "biax-heavy-duty-duffle-bag": 3,
          "biax-athletic-training-wear": 4,
          "biax-sports-training-shoes": 5,
        };
        const orderA = order[a.slug] ?? 99;
        const orderB = order[b.slug] ?? 99;
        return orderA - orderB;
      });
      return sorted.slice(0, 4);
    }

    if (activeTab === "bestsellers") {
      // Prioritize high-volume items: Football, T-Shirt, Duffle, Gi
      const best = allItems.filter((p) => p.bestSeller || (p.stock && p.stock > 0));
      const sorted = [...(best.length >= 4 ? best : allItems)].sort((a, b) => {
        const order: Record<string, number> = {
          "biax-training-football": 1,
          "biax-performance-training-tshirt": 2,
          "biax-heavy-duty-duffle-bag": 3,
          "biax-martial-arts-training-uniform": 4,
          "biax-athletic-training-wear": 5,
        };
        const orderA = order[a.slug] ?? 99;
        const orderB = order[b.slug] ?? 99;
        return orderA - orderB;
      });
      return sorted.slice(0, 4);
    }

    // Default "All Picks (6)": The standard 4 core curated items
    return allItems.slice(0, 4);
  }, [allItems, activeTab]);

  return (
    <section className="w-full bg-white py-8 sm:py-12 lg:py-14 border-t border-neutral-100">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* SECTION HEADER (Matching FindYourFit and WhyChooseUs brand design) */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary sm:text-xs">
            Curated Gear · Handpicked
          </p>
          <h2 className="text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-neutral-950 sm:text-5xl lg:text-6xl">
            Featured &amp;{" "}
            <span className="text-transparent [-webkit-text-stroke:1.8px_#d71920] sm:[-webkit-text-stroke:2.4px_#d71920] transition-colors duration-300 hover:text-[#d71920]">
              Best-Sellers
            </span>
          </h2>
        </div>

        {/* SEGMENTED CAPSULE TAB BAR (Scrollable on small screens, centered on tablet/desktop) */}
        <div className="flex justify-start sm:justify-center mb-6 overflow-x-auto scrollbar-none pb-1">
          <div className="inline-flex shrink-0 items-center rounded-full bg-neutral-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-4 sm:px-5 py-2 transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-[#0b1329] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              All Picks ({allItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("featured")}
              className={`rounded-full px-4 sm:px-5 py-2 transition-all duration-200 ${
                activeTab === "featured"
                  ? "bg-[#0b1329] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Featured Gear
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bestsellers")}
              className={`rounded-full px-4 sm:px-5 py-2 transition-all duration-200 ${
                activeTab === "bestsellers"
                  ? "bg-[#0b1329] text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* 2-COLUMN ON MOBILE, 4-COLUMN ON DESKTOP */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 transition-opacity duration-300">
          {displayedItems.map((product) => (
            <FeatureProductCard
              key={`${activeTab}-${product.slug}`}
              product={product}
            />
          ))}
        </div>

        {/* VIEW ALL PRODUCTS CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1329] px-6 py-2.5 text-xs font-bold text-white shadow-md transition duration-200 hover:bg-primary hover:scale-[1.02] active:scale-95"
          >
            <span>View All Products</span>
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* SUBTLE TRUST BANNER STRIP */}
        <div className="mt-8 rounded-2xl border border-neutral-100 bg-[#f8f9fa] px-6 py-3.5 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80 gap-3 sm:gap-0">
            {/* Free shipping */}
            <div className="flex items-center justify-center gap-3.5 sm:px-6">
              <Truck
                size={26}
                strokeWidth={1.75}
                className="text-neutral-700 shrink-0"
              />
              <div>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  Free shipping across India
                </p>
                <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                  on qualifying orders
                </p>
              </div>
            </div>

            {/* Size exchanges */}
            <div className="flex items-center justify-center gap-3.5 pt-3 sm:pt-0 sm:px-6">
              <RotateCcw
                size={24}
                strokeWidth={1.75}
                className="text-neutral-700 shrink-0"
              />
              <div>
                <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                  Easy 7-day size exchanges
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
