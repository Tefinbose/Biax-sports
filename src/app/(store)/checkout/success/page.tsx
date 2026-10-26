import type { Metadata } from "next";
import { Suspense } from "react";
import OrderSuccessContent from "./success-content";

export const metadata: Metadata = {
  title: "Order Confirmed | BIAX SPORTS",
  description: "Your BIAX SPORTS order has been confirmed successfully.",
};

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto min-h-[75vh] max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
              Loading order confirmation...
            </p>
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
}
