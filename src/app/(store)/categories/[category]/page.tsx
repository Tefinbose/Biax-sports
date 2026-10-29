import { Suspense } from "react";
import Image from "next/image";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import Product, { type IProduct } from "@/models/Product";
import { connectToDatabase } from "@/lib/mongodb";
import ProductCard, { type StoreProduct } from "@/components/products/product-card";

export const instant = false;

const validCategories = [
  "sportswear",
  "martial-arts-uniforms",
  "sports-equipment",
  "lifestyle",
] as const;

type CategoryType = (typeof validCategories)[number];

const categoryHeroImages: Record<
  CategoryType,
  { src: string; alt: string; position: string }
> = {
  sportswear: {
    src: "/images/sports-wear/image.jpg",
    alt: "BIAX sportswear training collection",
    position: "object-center",
  },
  "martial-arts-uniforms": {
    src: "/images/martial-arts/image.jpg",
    alt: "BIAX martial arts uniform and combat gear",
    position: "object-[center_25%]",
  },
  "sports-equipment": {
    src: "/images/sports-equipments/pexels-mjrfilms-38593700.jpg",
    alt: "BIAX tournament sports equipment",
    position: "object-[center_60%]",
  },
  lifestyle: {
    src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1920&q=80",
    alt: "BIAX lifestyle casual and streetwear collection",
    position: "object-center",
  },
};

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

function CategoryProductsFallback() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
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

async function CategoryProductList({ category }: { category: string }) {
  await connection();
  await connectToDatabase();

  const products = await Product.find({
    category: category as IProduct["category"],
    published: true,
  })
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  const serializableProducts = JSON.parse(
    JSON.stringify(products)
  ) as StoreProduct[];

  if (serializableProducts.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-neutral-200 bg-neutral-50/70 px-5 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-md">
          <ShoppingBag size={28} />
        </div>

        <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-neutral-950">
          No products yet
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-neutral-600">
          There are no published products in this category right now. Please check back soon.
        </p>

        <Link
          href="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
        >
          Explore all products <ArrowRight size={17} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {serializableProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category as CategoryType)) {
    notFound();
  }

  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const currentCategory = category as CategoryType;
  const heroConfig =
    categoryHeroImages[currentCategory] ?? categoryHeroImages.sportswear;

  return (
    <main className="min-h-screen bg-white">
      {/* CATEGORY HERO */}
      <section className="relative overflow-hidden bg-neutral-950 px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Category matching background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroConfig.src}
            alt={heroConfig.alt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${heroConfig.position} opacity-65`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.02)_46px_48px)]" />
        </div>

        {/* athletic primary glow */}
        <div className="pointer-events-none absolute -right-24 top-0 z-0 h-[420px] w-[420px] rounded-full bg-primary/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              All Collection
            </Link>
            <span className="text-white/30">/</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur sm:text-xs">
              Category
            </span>
          </div>

          <h1 className="text-2xl font-black uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            {categoryName}
            <span className="text-transparent [-webkit-text-stroke:1.2px_#ffffff] sm:[-webkit-text-stroke:1.8px_#ffffff]">.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
            Discover performance-focused gear selected to support
            your training, discipline, and next challenge.
          </p>

          <div className="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1 sm:flex-wrap">
            {validCategories
              .filter((c) => c !== category)
              .map((c) => (
                <Link
                  key={c}
                  href={`/categories/${c}`}
                  className="shrink-0 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur transition duration-300 hover:border-white hover:bg-white hover:text-neutral-950 active:scale-95"
                >
                  {c.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <Suspense fallback={<CategoryProductsFallback />}>
          <CategoryProductList category={category} />
        </Suspense>
      </section>
    </main>
  );
}
