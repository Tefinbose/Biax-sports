"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Heart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from "lucide-react";
import {
  getCartSubtotal,
  readCart,
  saveCart,
  type CartItem,
} from "@/lib/cart";

type PaymentMethod = "cod" | "online";

type CreatedOrder = {
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  orderStatus: string;
};

type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
  customerNotes: string;
};

const initialForm: CheckoutFormData = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  paymentMethod: "cod",
  customerNotes: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CheckoutForm() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  // Promo code feature
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
      setCart(readCart());
      setCartLoaded(true);
    };

    loadCart();

    window.addEventListener("storage", loadCart);
    window.addEventListener("biax-cart-updated", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("biax-cart-updated", loadCart);
    };
  }, []);

  const subtotal = getCartSubtotal(cart);
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const shippingCharge = 0; // Free express delivery across India
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  function updateField<K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Interactive step validation indicators
  const isContactValid =
    form.name.trim().length >= 2 &&
    form.email.includes("@") &&
    form.email.includes(".") &&
    form.phone.trim().length >= 10;

  const isAddressValid =
    form.addressLine1.trim().length >= 3 &&
    form.city.trim().length >= 2 &&
    form.state.trim().length >= 2 &&
    /^\d{6}$/.test(form.postalCode.trim());

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoMessage(null);
    const cleaned = promoInput.trim().toUpperCase();

    if (!cleaned) return;

    if (cleaned === "BIAX10" || cleaned === "IMPACT10" || cleaned === "WELCOME10") {
      setAppliedPromo({ code: cleaned, discountPercent: 10 });
      setPromoMessage({
        type: "success",
        text: `Code '${cleaned}' applied! 10% discount subtracted from your order.`,
      });
      setPromoInput("");
    } else {
      setPromoMessage({
        type: "error",
        text: "Invalid promo code. Try 'BIAX10' for 10% off your order.",
      });
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoMessage(null);
  }

  async function handleCopyOrder(orderNumber: string) {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    } catch {
      // Fallback
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!isContactValid) {
      setError("Please provide a valid full name, email address, and 10-digit mobile number.");
      return;
    }

    if (!isAddressValid) {
      setError("Please complete your delivery address and enter a valid 6-digit Indian PIN code.");
      return;
    }

    // Verify database product IDs
    const invalidItem = cart.some(
      (item) =>
        !item.productId ||
        typeof item.productId !== "string" ||
        item.productId.length === 0,
    );

    if (invalidItem) {
      setError("A product in your cart has invalid information. Please re-add it from the store.");
      return;
    }

    setSubmitting(true);

    try {
      const notesWithPromo = appliedPromo
        ? `${form.customerNotes ? form.customerNotes + " | " : ""}Promo applied: ${appliedPromo.code} (10% off)`
        : form.customerNotes;

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
          },
          shippingAddress: {
            addressLine1: form.addressLine1.trim(),
            addressLine2: form.addressLine2.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postalCode.trim(),
            country: form.country.trim(),
          },
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod: form.paymentMethod,
          customerNotes: notesWithPromo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place your order. Please try again.");
      }

      const order = result.order as CreatedOrder;

      // Clear cart
      saveCart([]);
      setCart([]);
      window.dispatchEvent(new Event("biax-cart-updated"));

      setCreatedOrder(order);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // 1. Loading Skeleton
  if (!cartLoaded) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50/70 p-16 text-center">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-600">
          Preparing secure checkout session...
        </p>
      </div>
    );
  }

  // 2. Order Confirmation Celebration Screen
  if (createdOrder) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/50">
          <CheckCircle2 size={42} className="stroke-[2.5]" />
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-800">
            Order Placed Successfully
          </span>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-neutral-950 sm:text-4xl">
            Thank you for your order!
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            A confirmation email has been dispatched to{" "}
            <span className="font-bold text-neutral-900">{form.email || "your email"}</span>.
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
                {createdOrder.orderNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyOrder(createdOrder.orderNumber)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
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
                {formatPrice(createdOrder.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Option</span>
              <span className="font-bold text-neutral-900">
                {createdOrder.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Online Payment"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Status</span>
              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold uppercase text-amber-800">
                {createdOrder.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Estimated Delivery</span>
              <span className="font-bold text-green-700">3–5 Business Days (Standard)</span>
            </div>

            {createdOrder.paymentMethod === "online" && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 text-xs leading-5 text-blue-900">
                <span className="font-bold">Notice:</span> Online payment gateway integration is currently in sandbox testing. Please coordinate with support if you wish to pre-pay via UPI or bank transfer.
              </div>
            )}
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

  // 3. Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-neutral-950 sm:text-3xl">
          Your shopping bag is empty
        </h2>
        <p className="mt-2.5 text-sm text-neutral-600">
          Discover performance athletic wear, martial arts uniforms, and gear ready for training.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
        >
          Explore Collection
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* MOBILE COLLAPSIBLE ORDER SUMMARY BAR (Sticky Top on Small Devices) */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSummaryOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:bg-neutral-50"
          aria-expanded={isMobileSummaryOpen}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-950">
                <span>Order Summary</span>
                <span className="text-primary font-bold">({totalQuantity} items)</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {isMobileSummaryOpen ? "Tap to collapse" : "Tap to review items & promo"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-black text-neutral-950">{formatPrice(total)}</span>
            {isMobileSummaryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Unfolded Mobile Drawer */}
        {isMobileSummaryOpen && (
          <div className="mt-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                        Gear
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black uppercase text-neutral-950">{item.name}</p>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                    <p className="text-xs font-black text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-neutral-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-950">{formatPrice(subtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold text-green-700 uppercase">FREE</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm font-black text-neutral-950">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE COMPACT STEPPER */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:hidden">
        <div
          className={`flex items-center gap-1.5 rounded-xl border p-2 text-[10px] font-bold uppercase transition-colors ${
            isContactValid
              ? "border-green-200 bg-green-50/70 text-green-800"
              : "border-neutral-200 bg-white text-neutral-600"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black transition-colors ${
              isContactValid ? "bg-green-600 text-white" : "bg-neutral-900 text-white"
            }`}
          >
            {isContactValid ? <Check size={10} /> : "1"}
          </span>
          <span className="truncate">Contact</span>
        </div>

        <div
          className={`flex items-center gap-1.5 rounded-xl border p-2 text-[10px] font-bold uppercase transition-colors ${
            isAddressValid
              ? "border-green-200 bg-green-50/70 text-green-800"
              : "border-neutral-200 bg-white text-neutral-600"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-black transition-colors ${
              isAddressValid ? "bg-green-600 text-white" : "bg-neutral-900 text-white"
            }`}
          >
            {isAddressValid ? <Check size={10} /> : "2"}
          </span>
          <span className="truncate">Shipping</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-2 text-[10px] font-bold uppercase text-neutral-600">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-black text-white">
            3
          </span>
          <span className="truncate">Payment</span>
        </div>
      </div>

      {/* INTERACTIVE PROGRESS STEPPER (Desktop) */}
      <div className="mb-8 hidden sm:grid grid-cols-3 gap-3">
        {/* Step 1 */}
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
            isContactValid
              ? "border-green-200 bg-green-50/50 shadow-sm"
              : "border-neutral-200 bg-white"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${
              isContactValid ? "bg-green-600 text-white" : "bg-neutral-950 text-white"
            }`}
          >
            {isContactValid ? <Check size={16} /> : "1"}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-950">1. Contact</p>
            <p className="text-[11px] text-neutral-500">
              {isContactValid ? "Verified" : "Name, Email & Phone"}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
            isAddressValid
              ? "border-green-200 bg-green-50/50 shadow-sm"
              : "border-neutral-200 bg-white"
          }`}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-colors ${
              isAddressValid ? "bg-green-600 text-white" : "bg-neutral-950 text-white"
            }`}
          >
            {isAddressValid ? <Check size={16} /> : "2"}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-950">2. Shipping</p>
            <p className="text-[11px] text-neutral-500">
              {isAddressValid ? "Verified" : "Delivery Address & PIN"}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-xs font-black text-white">
            3
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-neutral-950">3. Payment</p>
            <p className="text-[11px] text-neutral-500">
              {form.paymentMethod === "cod" ? "Cash on Delivery" : "Online Gateway"}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CHECKOUT GRID */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* LEFT COLUMN: FORM INPUT STEPS (Span 7) */}
        <div className="space-y-6 lg:col-span-7">
          {/* STEP 1: CONTACT INFORMATION */}
          <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                  {isContactValid ? <Check size={14} className="text-green-400" /> : "1"}
                </span>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                    Contact Information
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Order confirmations and delivery SMS notifications
                  </p>
                </div>
              </div>

              {isContactValid && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <CheckCircle2 size={13} />
                  Ready
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="customer-name">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <User size={16} />
                  </span>
                  <input
                    id="customer-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="e.g. Arjun Menon"
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="customer-email">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <Mail size={16} />
                  </span>
                  <input
                    id="customer-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    maxLength={254}
                    placeholder="arjun@example.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Phone Number with +91 Country Tag */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="customer-phone">
                  Mobile Number <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2 flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-100 px-3.5 text-xs font-bold text-neutral-700">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <input
                      id="customer-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, ""))}
                      required
                      minLength={10}
                      maxLength={15}
                      placeholder="98765 43210"
                      className="w-full rounded-r-xl border border-neutral-300 bg-white py-3.5 pl-3.5 pr-4 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-neutral-400">
                  Required for delivery updates via courier SMS
                </p>
              </div>
            </div>
          </section>

          {/* STEP 2: SHIPPING ADDRESS */}
          <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                  {isAddressValid ? <Check size={14} className="text-green-400" /> : "2"}
                </span>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                    Delivery Address
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Shipped with free express delivery across all India PIN codes
                  </p>
                </div>
              </div>

              {isAddressValid && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <CheckCircle2 size={13} />
                  Ready
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Address Line 1 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="address-1">
                  Street Address / Flat / Building <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <MapPin size={16} />
                  </span>
                  <input
                    id="address-1"
                    type="text"
                    autoComplete="address-line1"
                    value={form.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                    required
                    minLength={3}
                    maxLength={200}
                    placeholder="Flat 4B, Greenfield Heights, 12th Cross Road"
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Address Line 2 */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="address-2">
                  Landmark / Area <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="address-2"
                  type="text"
                  autoComplete="address-line2"
                  value={form.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  maxLength={200}
                  placeholder="Near Sports Complex, Memunda Post"
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="address-city">
                  City / Town <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                    <Building2 size={16} />
                  </span>
                  <input
                    id="address-city"
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="e.g. Kozhikode"
                    className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 pl-11 pr-4 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* State Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="address-state">
                  State / UT <span className="text-primary">*</span>
                </label>
                <div className="relative mt-2">
                  <select
                    id="address-state"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">Select your state...</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700" htmlFor="address-postal">
                  PIN Code (6 Digits) <span className="text-primary">*</span>
                </label>
                <input
                  id="address-postal"
                  type="text"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="e.g. 673104"
                  maxLength={6}
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-sm font-semibold tracking-wider text-neutral-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <p className="mt-1 text-[10px] text-neutral-400">
                  {form.postalCode.length === 6
                    ? "✓ Valid PIN length"
                    : `${6 - form.postalCode.length} digits remaining`}
                </p>
              </div>

              {/* Country (Pre-locked India) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Country
                </label>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-100/80 px-4 py-3.5 text-sm font-bold text-neutral-800">
                  <span>India</span>
                  <span className="rounded-md bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                    All PINs Covered
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: PAYMENT METHOD */}
          <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                  3
                </span>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                    Payment Method
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Choose how you would like to pay for your gear
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200 ${
                  form.paymentMethod === "cod"
                    ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={() => updateField("paymentMethod", "cod")}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-neutral-950">
                      <Banknote size={18} className="text-green-600" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-800">
                      Most Popular
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-neutral-600">
                    Pay in cash or UPI scan directly to the delivery courier upon receiving your parcel at your doorstep. Zero advance payment needed.
                  </p>
                </div>
              </label>

              {/* Option 2: Online Payment */}
              <label
                className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200 ${
                  form.paymentMethod === "online"
                    ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={form.paymentMethod === "online"}
                  onChange={() => updateField("paymentMethod", "online")}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-neutral-950">
                      <CreditCard size={18} className="text-blue-600" />
                      Online Payment (UPI, Cards, NetBanking)
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-neutral-600">
                    Selecting this creates your order and reserves stock while our online payment gateway is being finalized.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* STEP 4: DELIVERY NOTES */}
          <section className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <h2 className="text-base font-black uppercase tracking-tight text-neutral-950">
              Delivery Instructions <span className="text-neutral-400 font-normal text-xs">(Optional)</span>
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Provide landmark details, gate code, or delivery timing instructions for the courier.
            </p>
            <textarea
              id="customer-notes"
              rows={3}
              maxLength={500}
              value={form.customerNotes}
              onChange={(e) => updateField("customerNotes", e.target.value)}
              placeholder="e.g. Please deliver between 2 PM - 6 PM or leave with security."
              className="mt-3 w-full rounded-xl border border-neutral-300 bg-white p-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <p className="mt-1 text-right text-[10px] text-neutral-400">
              {form.customerNotes.length}/500 characters
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN: STICKY ORDER SUMMARY PANEL (Span 5) */}
        <aside className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-neutral-950">
                <ShoppingBag size={18} />
                Order Summary
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-700">
                {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Scrollable Items List */}
            <div className="mt-5 max-h-72 divide-y divide-neutral-100 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                        Gear
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black uppercase text-neutral-950 sm:text-sm">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-semibold text-neutral-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="mt-0.5 text-xs font-black text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Promo Code Form */}
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <Tag size={14} />
                  </span>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. BIAX10)"
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
            <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
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
                  All-India Express Delivery
                </span>
                <span className="font-black text-xs uppercase tracking-wider text-green-700">
                  FREE
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
                <div>
                  <span className="text-base font-black text-neutral-950">Total Amount</span>
                  <p className="text-[10px] text-neutral-400">Includes all GST & shipping charges</p>
                </div>
                <span className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-primary"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Main Place Order Button */}
            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>
                    {form.paymentMethod === "cod"
                      ? `Place Order (COD) • ${formatPrice(total)}`
                      : `Confirm Order • ${formatPrice(total)}`}
                  </span>
                </>
              )}
            </button>

            {/* Modify in Bag Link */}
            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
            >
              Modify Bag Items
            </Link>

            {/* Trust Assurances */}
            <div className="mt-6 border-t border-neutral-100 pt-5 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                <span>256-Bit SSL Encrypted & Protected Checkout</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Truck size={16} className="text-blue-600 shrink-0" />
                <span>Dispatched directly from Kerala logistics hub</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <RefreshCw size={16} className="text-primary shrink-0" />
                <span>7-Day Easy Size Exchange Policy</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
