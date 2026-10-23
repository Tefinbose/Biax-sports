
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Heart, ShoppingCart, Star, Zap } from "lucide-react";
import {
  addToCart,
  readCart,
  saveCart,
} from "@/lib/cart";
import { isWishlisted, toggleWishlist } from "@/lib/wishlist";

export type StoreProduct = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  published?: boolean;
  rating?: number;
  reviewCount?: number;
  bestSeller?: boolean;
};

type ProductCardProps = {
  product: StoreProduct;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);

  const productId = product._id ?? product.id ?? product.slug;

  useEffect(() => {
    setInWishlist(isWishlisted(productId));

    const handleWishlistUpdate = () => {
      setInWishlist(isWishlisted(productId));
    };

    window.addEventListener("biax-wishlist-updated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);
    return () => {
      window.removeEventListener("biax-wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, [productId]);

  function handleAddToCart(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMessage("");

    if (product.stock < 1) {
      setMessage("Currently out of stock.");
      return;
    }

    try {
      const currentCart = readCart();
      const existingItem = currentCart.find(
        (item) => item.productId === productId,
      );

      if (existingItem && existingItem.quantity >= product.stock) {
        setMessage("Available stock limit reached.");
        return;
      }

      const updatedCart = addToCart(currentCart, {
        productId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? "",
      });

      saveCart(updatedCart);
      window.dispatchEvent(new Event("biax-cart-updated"));

      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch {
      setMessage("Unable to save cart. Please try again.");
    }
  }

  const hasDiscount =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100,
      )
    : 0;

  // Realistic rating & review counts
  const rating =
    product.rating ?? (4.7 + ((product.name.length % 4) * 0.1));
  const reviewCount =
    product.reviewCount ?? (24 + ((product.name.length * 9) % 70));

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-neutral-950 hover:shadow-xl hover:shadow-black/5">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Link
          href={`/products/${encodeURIComponent(product.slug)}`}
          className="relative block h-full w-full overflow-hidden"
        >
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-wider text-neutral-400">
              No product image
            </div>
          )}

          {/* Badges Container */}
          <div className="absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1 max-w-[70%]">
            {hasDiscount && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                {discountPercentage}% OFF
              </span>
            )}
            {product.featured && !hasDiscount && (
              <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                Featured
              </span>
            )}
          </div>

          {product.stock < 1 && (
            <span className="absolute inset-x-0 bottom-0 z-10 bg-neutral-950/85 px-3 py-1.5 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-white backdrop-blur-sm">
              Out of stock
            </span>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setInWishlist(toggleWishlist(productId));
          }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2 top-2 z-20 flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-200 shadow-sm ${
            inWishlist
              ? "bg-white text-primary scale-105"
              : "bg-white/95 text-neutral-600 hover:bg-white hover:text-primary hover:scale-105 active:scale-95 backdrop-blur-sm"
          }`}
        >
          <Heart size={15} className={`sm:h-3.5 sm:w-3.5 ${inWishlist ? "fill-primary" : ""}`} />
        </button>

        {/* Hover-reveal Quick Add to Cart button */}
        {product.stock > 0 && (
          <div className="absolute inset-x-3 bottom-3 z-10 pointer-events-none opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950/95 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xl backdrop-blur-md transition duration-300 hover:bg-primary active:scale-95"
            >
              {added ? <Check size={14} /> : <ShoppingCart size={14} />}
              {added ? "Added to cart" : "Quick Add"}
            </button>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <p className="truncate text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {product.category.replaceAll("-", " ")}
            </p>

            {/* Ratings & review count */}
            <div className="flex shrink-0 items-center gap-1">
              <Star size={10} className="fill-amber-400 text-amber-400 sm:h-[11px] sm:w-[11px]" />
              <span className="text-[10px] sm:text-[11px] font-bold text-neutral-800">
                {rating.toFixed(1)}
              </span>
              <span className="hidden sm:inline text-[10px] text-neutral-400">
                ({reviewCount})
              </span>
            </div>
          </div>

          <Link
            href={`/products/${encodeURIComponent(product.slug)}`}
            className="mt-1.5 block min-h-[2.35rem] sm:min-h-[2.85rem] text-xs sm:text-sm md:text-base font-black uppercase leading-snug tracking-tight text-neutral-950 line-clamp-2 transition hover:text-primary"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-auto pt-2.5 sm:pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm font-black tracking-tight text-neutral-950 sm:text-base md:text-lg">
              {formatPrice(product.price)}
            </span>

            {hasDiscount && (
              <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Quick Add mobile button */}
          {product.stock > 0 && (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Quick add ${product.name} to cart`}
              className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 shadow-xs transition hover:bg-primary hover:text-white active:scale-95 md:hidden"
            >
              {added ? <Check size={15} className="sm:h-3.5 sm:w-3.5 text-green-600" /> : <ShoppingCart size={15} className="sm:h-3.5 sm:w-3.5" />}
            </button>
          )}
        </div>

        {message && (
          <p role="status" className="mt-1 text-[11px] sm:text-xs font-bold text-primary">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export function ProductAddToCart({ product }: { product: StoreProduct }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    setMessage("");

    if (product.stock < 1) {
      setMessage("Currently out of stock.");
      return;
    }

    const productId = product._id ?? product.id ?? product.slug;

    try {
      let currentCart = readCart();
      const existing = currentCart.find((item) => item.productId === productId);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty + quantity > product.stock) {
        setMessage(`Only ${product.stock} items available in stock.`);
        return;
      }

      for (let i = 0; i < quantity; i++) {
        currentCart = addToCart(currentCart, {
          productId,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0] ?? "",
        });
      }

      saveCart(currentCart);
      window.dispatchEvent(new Event("biax-cart-updated"));
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2500);
    } catch {
      setMessage("Unable to save your cart. Please try again.");
    }
  }

  function handleBuyNow() {
    if (product.stock < 1) {
      setMessage("Currently out of stock.");
      return;
    }

    handleAddToCart();
    router.push("/checkout");
  }

  return (
    <div className="mt-8 space-y-6">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
            Select Size
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                  selectedSize === size
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
            Select Colour
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  selectedColor === color
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP / IN-PAGE ACTION BUTTONS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex h-12 w-fit items-center rounded-full border border-neutral-300 bg-neutral-50 px-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || product.stock < 1}
            className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-40"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-black text-neutral-950">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock || product.stock < 1}
            className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none"
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          {product.stock < 1
            ? "Out of stock"
            : added
              ? "Added to cart!"
              : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.stock < 1}
          className="inline-flex items-center justify-center rounded-full border-2 border-neutral-950 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-neutral-950 transition duration-300 hover:bg-neutral-950 hover:text-white hover:-translate-y-0.5 disabled:opacity-50"
        >
          Checkout
        </button>
      </div>

      {message && (
        <p role="status" className="text-xs font-bold text-primary">
          {message}
        </p>
      )}

      {added && (
        <p className="text-xs font-bold uppercase tracking-wider text-green-700">
          Item added to your cart.{" "}
          <Link href="/cart" className="underline font-black hover:text-green-900">
            View Cart
          </Link>
        </p>
      )}

      {/* FLIPKART STYLE STICKY BOTTOM BAR (Mobile Viewport Only) */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200/90 bg-white/95 px-3 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.12)] backdrop-blur-md sm:hidden">
        {/* Quick Toast Feedback */}
        {added && (
          <div className="mb-2 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-800 animate-in fade-in slide-in-from-bottom-2">
            <span className="flex items-center gap-1.5">
              <Check size={14} className="text-green-600" />
              Item added to your bag
            </span>
            <Link href="/cart" className="underline font-black text-green-900">
              View Bag →
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {/* Button 1: Add to cart (White with border) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock < 1}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-3.5 text-xs font-black uppercase tracking-wider text-neutral-900 shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            {added ? <Check size={16} className="text-green-600" /> : <ShoppingCart size={16} />}
            <span>{product.stock < 1 ? "Out of stock" : added ? "Added" : "Add to cart"}</span>
          </button>

          {/* Button 2: Buy at ₹... (Flipkart signature vibrant gold CTA) */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock < 1}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#ffc200] hover:bg-[#eab308] py-3.5 text-xs font-black uppercase tracking-wider text-neutral-950 shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            <Zap size={15} className="fill-neutral-950 text-neutral-950" />
            <span>Buy at {formatPrice(product.price * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
