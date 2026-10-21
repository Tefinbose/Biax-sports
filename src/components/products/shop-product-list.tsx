
import { connection } from "next/server";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard, {
  type StoreProduct,
} from "@/components/products/product-card";

export default async function ShopProductList() {
  // This component runs inside the Suspense boundary in the Shop page.
  await connection();

  let products: StoreProduct[] = [];

  try {
    await connectToDatabase();

    const results = await Product.find({ published: true })
      .select(
        "name slug shortDescription category price compareAtPrice images stock featured",
      )
      .sort({ featured: -1, createdAt: -1 })
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
    console.error("Shop page could not load products:", error);

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-neutral-950">
          Products are temporarily unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Check your MongoDB connection string, database network access
          settings, and the server terminal for errors.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            The BIAX collection
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-neutral-950 sm:text-4xl">
            All <span className="text-primary">products.</span>
          </h2>
        </div>

        <p className="inline-flex self-start items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-700 sm:self-auto">
          {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-neutral-200 bg-neutral-50/70 px-5 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-md">
            <ShoppingBag size={28} />
          </div>

          <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-neutral-950">
            The collection is coming soon
          </h3>

          <p className="mt-3 max-w-md text-sm leading-7 text-neutral-600">
            Our product collection will appear here when products have been
            added to the database and published.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
          >
            Back to home <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </>
  );
}
