
import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductImageGallery from "@/components/products/product-image-gallery";
import { ProductAddToCart, type StoreProduct } from "@/components/products/product-card";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  await connection();

  try {
    await connectToDatabase();

    const product = await Product.findOne({
      slug,
      published: true,
    })
      .select("name shortDescription description")
      .lean();

    if (!product) {
      return { title: "Product Not Found" };
    }

    return {
      title: product.name,
      description:
        product.shortDescription ||
        product.description.slice(0, 160),
    };
  } catch {
    return { title: "Product Details" };
  }
}

function ProductFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100 lg:col-span-5" />
        <div className="space-y-4 py-4 lg:col-span-7">
          <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-100" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-100" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-100" />
          <div className="h-20 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

async function ProductContent({ slug }: { slug: string }) {
  await connection();

  let product;

  try {
    await connectToDatabase();

    product = await Product.findOne({
      slug,
      published: true,
    })
      .select(
        "name slug description shortDescription category price compareAtPrice images sizes colors stock sku isComingSoon",
      )
      .lean();
  } catch (error) {
    console.error("Failed to load product details:", error);

    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-2xl font-black uppercase">
          Product temporarily unavailable
        </h1>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          We could not load this product. Please check your connection and
          try again.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  const categoryNames: Record<string, string> = {
    sportswear: "Sportswear",
    "martial-arts-uniforms": "Martial Arts Uniforms",
    "sports-equipment": "Sports Equipment",
  };

  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  const compareAtPrice = product.compareAtPrice;

  const serializedProduct: StoreProduct = {
    _id: String(product._id),
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    category: product.category,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images ?? [],
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    stock: product.stock,
    isComingSoon: Boolean(product.isComingSoon),
  };

  return (
    <main className="min-h-screen bg-white pb-24 sm:pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-700 transition duration-300 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to collection
        </Link>
      </div>

      {/* COMPACT PRODUCT CARD CONTAINER */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:grid lg:grid-cols-12 lg:items-start">
          {/* LEFT: Product Gallery (Enhanced for Multi-Image) */}
          <div className="p-6 lg:col-span-6 lg:sticky lg:top-24 lg:p-8">
            <ProductImageGallery
              images={product.images ?? []}
              productName={product.name}
            />
          </div>

          {/* RIGHT: Product Details (Streamlined flow, direct size/color selection) */}
          <div className="border-t border-neutral-100 p-6 sm:p-8 lg:col-span-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                {categoryNames[product.category] ?? product.category}
              </span>

              {product.isComingSoon && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-sm">
                  Coming Soon
                </span>
              )}

              {!product.isComingSoon && product.stock < 1 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-black uppercase leading-tight tracking-tight text-neutral-950 sm:text-3xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-black tracking-tight text-neutral-950">
                {currency.format(product.price)}
              </span>

              {hasDiscount && typeof compareAtPrice === "number" && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    {currency.format(compareAtPrice)}
                  </span>
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                    {Math.round(
                      ((compareAtPrice - product.price) /
                        compareAtPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1 text-xs font-bold text-green-700">
                  <CheckCircle2 size={14} className="text-green-600" />
                  In stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-bold text-primary">
                  Currently out of stock
                </span>
              )}
            </div>

            {/* DIRECT CLICKABLE SIZE & COLOUR SELECTION + ADD TO CART */}
            <div className="border-t border-neutral-100 mt-5 pt-4">
              <ProductAddToCart product={serializedProduct} />
            </div>

            {/* Trust Badges & Delivery Info */}
            <div className="mt-6 space-y-2.5 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="shrink-0 text-primary" />
                <span className="font-medium text-neutral-800">
                  Fast shipping across India. Calculated at checkout.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="shrink-0 text-primary" />
                <span className="font-medium text-neutral-800">
                  100% Genuine BIAX SPORTS Gear — Built for Impact.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-50/60">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            The BIAX Standard
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-neutral-950 sm:text-3xl">
            Engineered for <span className="text-primary">Performance.</span>
          </h2>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">
              {product.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <span>SKU: {product.sku}</span>
              <span>Authentic BIAX Sports Gear</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductContent slug={slug} />
    </Suspense>
  );
}
