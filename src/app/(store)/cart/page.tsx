"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import {
  getCartSubtotal,
  readCart,
  removeFromCart,
  saveCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  // Promo code test in cart
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);
  const [promoMessage, setPromoMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadCart = () => {
      setItems(readCart());
      setReady(true);
    };

    loadCart();

    window.addEventListener("storage", loadCart);
    window.addEventListener("biax-cart-updated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("biax-cart-updated", loadCart);
    };
  }, []);

  function updateItems(nextItems: CartItem[]) {
    setItems(nextItems);

    try {
      saveCart(nextItems);
      window.dispatchEvent(new Event("biax-cart-updated"));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function changeQuantity(productId: string, quantity: number) {
    updateItems(updateCartQuantity(items, productId, quantity));
  }

  function deleteItem(productId: string) {
    updateItems(removeFromCart(items, productId));
  }

  function handleClearCart() {
    if (window.confirm("Are you sure you want to remove all items from your bag?")) {
      updateItems([]);
      setAppliedPromo(null);
      setPromoMessage(null);
    }
  }

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoMessage(null);
    const cleaned = promoInput.trim().toUpperCase();

    if (!cleaned) return;

    if (cleaned === "BIAX10" || cleaned === "IMPACT10" || cleaned === "WELCOME10") {
      setAppliedPromo({ code: cleaned, discountPercent: 10 });
      setPromoMessage({
        type: "success",
        text: `Code '${cleaned}' applied! 10% discount subtracted.`,
      });
      setPromoInput("");
    } else {
      setPromoMessage({
        type: "error",
        text: "Invalid promo code. Try 'BIAX10' for 10% off.",
      });
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoMessage(null);
  }

  const subtotal = getCartSubtotal(items);
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalQuantity = items.reduce((totalCount, item) => totalCount + item.quantity, 0);

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-[1440px] items-center justify-center px-5 py-20 text-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
            Loading your shopping bag...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 pb-24 sm:pb-16">
      {/* HEADER ROW */}
      <div className="mb-8 flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            BIAX SPORTS · Shopping Bag
          </p>
          <h1 className="mt-2.5 text-3xl font-black uppercase leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Your{" "}
            <span className="text-transparent [-webkit-text-stroke:1.8px_#d71920] transition-colors duration-300 hover:text-[#d71920] sm:[-webkit-text-stroke:2.4px_#d71920]">
              bag
            </span>
          </h1>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} selected for training & competition
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="group inline-flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-wider text-neutral-400 transition hover:text-primary sm:self-auto"
          >
            <Trash2 size={14} className="transition-transform group-hover:scale-110" />
            Clear all items
          </button>
        )}
      </div>

      {storageError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-primary"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>
            Your browser could not save the latest cart changes. Please check your storage settings and try again.
          </span>
        </div>
      )}

      {items.length === 0 ? (
        /* EMPTY CART STATE */
        <section className="flex flex-col items-center rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 ring-8 ring-neutral-50">
            <ShoppingBag size={34} />
          </div>
          <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-neutral-950 sm:text-3xl">
            Your bag is currently empty
          </h2>
          <p className="mt-2.5 max-w-md text-sm leading-6 text-neutral-600">
            Discover tournament-grade martial arts uniforms, moisture-wicking compression tees, and training gear built for athletes.
          </p>

          {/* Quick Category Suggestions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Quick explore:
            </span>
            <Link
              href="/categories/sportswear"
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            >
              Sportswear
            </Link>
            <Link
              href="/categories/martial-arts-uniforms"
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            >
              Martial Arts
            </Link>
            <Link
              href="/categories/sports-equipments"
              className="rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
            >
              Equipment
            </Link>
          </div>

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95"
          >
            Explore Collection
            <ArrowRight size={15} />
          </Link>
        </section>
      ) : (
        /* CART CONTENT GRID */
        <div className="grid items-start gap-8 lg:grid-cols-12">
          {/* LEFT: ITEMS LIST (Span 7) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Free Shipping Highlight Banner */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-green-200 bg-green-50/70 p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                <Truck size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-green-900">
                    Free Express Delivery
                  </span>
                  <span className="rounded-full bg-green-200/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-green-900">
                    Unlocked
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-green-800">
                  Complimentary courier shipping across all 19,000+ Indian PIN codes.
                </p>
              </div>
            </div>

            {/* Items Container Card */}
            <section className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-sm">
              <div className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <article
                    key={item.productId}
                    className="flex flex-col gap-4 p-5 transition hover:bg-neutral-50/40 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                  >
                    {/* Item Image */}
                    <Link
                      href={`/products/${encodeURIComponent(item.slug)}`}
                      className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 sm:h-28 sm:w-28"
                    >
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-400">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </Link>

                    {/* Item Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${encodeURIComponent(item.slug)}`}
                            className="block text-sm font-black uppercase leading-snug tracking-tight text-neutral-950 transition hover:text-primary sm:text-base line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs font-bold text-neutral-500">
                            Unit Price: <span className="text-neutral-900">{formatPrice(item.price)}</span>
                          </p>
                        </div>

                        {/* Line Total (Mobile/Desktop) */}
                        <div className="text-right sm:hidden">
                          <p className="text-base font-black text-neutral-950">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Stock Assurance */}
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                        <CheckCircle2 size={13} />
                        <span>In stock · Ready to dispatch</span>
                      </div>

                      {/* Quantity Stepper & Remove Row */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex h-10 items-center rounded-full border border-neutral-300 bg-neutral-50 px-2 shadow-sm">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-200 active:scale-95"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 text-center text-xs font-black text-neutral-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-200 active:scale-95"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteItem(item.productId)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 transition hover:text-primary"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Line Total (Desktop) */}
                    <div className="hidden sm:block text-right">
                      <p className="text-lg font-black tracking-tight text-neutral-950">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-[10px] text-neutral-400">Total</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/60 px-6 py-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:text-primary"
                >
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                  Continue shopping
                </Link>
                <span className="text-xs text-neutral-500">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in bag
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT: STICKY ORDER SUMMARY (Span 5) */}
          <aside className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-neutral-950">
                  <ShoppingBag size={18} />
                  Order Summary
                </h2>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-700">
                  {totalQuantity} Items
                </span>
              </div>

              {/* Promo Code Box */}
              <div className="mt-5 border-b border-neutral-100 pb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Have a Promo Code?
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                      <Tag size={14} />
                    </span>
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. BIAX10"
                      disabled={appliedPromo !== null}
                      className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-9 pr-3 text-xs font-bold uppercase tracking-wider text-neutral-950 outline-none transition placeholder:normal-case placeholder:font-normal focus:border-primary disabled:bg-neutral-100"
                    />
                  </div>
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold text-neutral-600 transition hover:bg-red-50 hover:text-primary hover:border-red-200"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary active:scale-95"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {promoMessage && (
                  <p
                    className={`mt-2 text-xs font-bold ${
                      promoMessage.type === "success" ? "text-green-700" : "text-primary"
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="mt-5 space-y-3.5 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-neutral-950">{formatPrice(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between font-bold text-green-700">
                    <span className="inline-flex items-center gap-1">
                      <Tag size={13} />
                      Discount ({appliedPromo.code})
                    </span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={14} className="text-green-600" />
                    Express Shipping (India)
                  </span>
                  <span className="font-black text-xs uppercase tracking-wider text-green-700">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-neutral-500 text-xs">
                  <span>Estimated GST (India)</span>
                  <span>Included in prices</span>
                </div>

                <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
                  <div>
                    <span className="text-base font-black text-neutral-950">Estimated Total</span>
                    <p className="text-[10px] text-neutral-400">Final checkout price</p>
                  </div>
                  <span className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Main Checkout Button */}
              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95"
              >
                <span>Proceed to Checkout • {formatPrice(total)}</span>
                <ArrowRight size={15} />
              </Link>

              {/* Trust Assurances */}
              <div className="mt-6 border-t border-neutral-100 pt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <ShieldCheck size={16} className="text-green-600 shrink-0" />
                  <span>256-Bit SSL Encrypted & Protected Checkout</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <Banknote size={16} className="text-blue-600 shrink-0" />
                  <span>Cash on Delivery (COD) Available</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                  <RefreshCw size={16} className="text-primary shrink-0" />
                  <span>7-Day Easy Size Exchange Policy</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* STICKY BOTTOM CHECKOUT BAR (Mobile Only) */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-5 py-3 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] backdrop-blur-md sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Total ({totalQuantity} items)
              </p>
              <p className="text-lg font-black text-neutral-950">{formatPrice(total)}</p>
            </div>
            <Link
              href="/checkout"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 active:scale-95"
            >
              <span>Checkout</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
