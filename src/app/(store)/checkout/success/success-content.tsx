"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ShoppingBag,
} from "lucide-react";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [copiedOrder, setCopiedOrder] = useState(false);

  const orderNumber = searchParams.get("orderNumber") || "";
  const total = Number(searchParams.get("total")) || 0;
  const paymentMethod = searchParams.get("paymentMethod") || "cod";
  const paymentStatus = searchParams.get("paymentStatus") || "pending";
  const email = searchParams.get("email") || "";

  async function handleCopyOrder(num: string) {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    } catch {
      // Fallback
    }
  }

  if (!orderNumber) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-neutral-950 sm:text-3xl">
          No Recent Order Found
        </h2>
        <p className="mt-2.5 text-sm text-neutral-600">
          If you placed an order, a confirmation receipt has been sent to your email.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl sm:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
        <CheckCircle2 size={42} className="stroke-[2.5]" />
      </div>

      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-green-800">
          <Check size={14} className="stroke-[3]" />
          Order Placed Successfully
        </span>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-neutral-950 sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          A confirmation email has been dispatched to{" "}
          <span className="font-bold text-neutral-900">{email || "your email address"}</span>.
        </p>
      </div>

      {/* Order Details Receipt Box */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/80">
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Order Tracking ID
            </p>
            <p className="text-base font-black tracking-tight text-neutral-950 sm:text-lg">
              {orderNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopyOrder(orderNumber)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 active:scale-95"
          >
            {copiedOrder ? (
              <>
                <Check size={14} className="text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order Amount</span>
            <span className="text-base font-black text-neutral-950">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Payment Option</span>
            <span className="font-bold text-neutral-900">
              {paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Payment Status</span>
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold uppercase text-amber-800">
              {paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Estimated Delivery</span>
            <span className="font-bold text-green-700">3–5 Business Days (Express)</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
        >
          Continue Shopping
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-7 py-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-200 hover:text-neutral-950"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
