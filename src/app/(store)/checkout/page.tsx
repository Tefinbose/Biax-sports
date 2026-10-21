
import type { Metadata } from "next";
import CheckoutForm from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout | BIAX SPORTS",
  description: "Complete your BIAX SPORTS order securely.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* CHECKOUT HEADER */}
      <section className="relative isolate overflow-hidden bg-neutral-950 px-5 py-10 text-white sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.04)_46px_48px)]" />
        <div className="absolute -right-32 top-0 -z-10 h-[380px] w-[380px] rounded-full bg-primary/20 blur-3xl" />

        <div className="mx-auto max-w-[1440px]">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur sm:text-xs">
            BIAX SPORTS · Secure Checkout
          </p>

          <h1 className="text-2xl font-black uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Order{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_#ffffff] sm:[-webkit-text-stroke:1.8px_#ffffff]">
              checkout
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
            Enter your delivery details, review your order items, and confirm your order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <CheckoutForm />
      </section>
    </main>
  );
}
