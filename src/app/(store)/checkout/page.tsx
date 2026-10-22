
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import CheckoutForm from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout | BIAX SPORTS",
  description: "Complete your BIAX SPORTS order securely with fast all-India delivery.",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto min-h-[75vh] max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14 pb-24 sm:pb-16">
      {/* CHECKOUT HEADER ROW (Aligned with Cart page) */}
      <div className="mb-8 flex flex-col gap-4 border-b border-neutral-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-950"
            >
              <ArrowLeft size={12} />
              <span>Back to Bag</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              <Lock size={11} className="stroke-[2.5]" />
              BIAX SPORTS · Secure Checkout
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Order{" "}
            <span className="text-transparent [-webkit-text-stroke:1.8px_#d71920] transition-colors duration-300 hover:text-[#d71920] sm:[-webkit-text-stroke:2.4px_#d71920]">
              checkout
            </span>
          </h1>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
            Fast dispatch from our Kerala logistics hub across all Indian PIN codes
          </p>
        </div>

        {/* Security assurance pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-4 py-2.5 text-xs font-bold text-neutral-700">
          <ShieldCheck size={18} className="text-green-600 shrink-0" />
          <span>256-Bit SSL Encrypted Transaction</span>
        </div>
      </div>

      {/* CHECKOUT FORM BODY */}
      <CheckoutForm />
    </main>
  );
}
