"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, Tag } from "lucide-react";

const perks = [
  "Early access to new drops",
  "Exclusive subscriber discounts",
  "Training tips & athlete stories",
  "Flash sale alerts",
];

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Simulate async lead capture
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="relative isolate overflow-hidden border-t border-neutral-200/80 bg-neutral-950 px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12">
      {/* Diagonal stripe texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.025)_46px_48px)]" />
      {/* Red glow blob */}
      <div className="pointer-events-none absolute -right-48 -top-48 -z-10 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left: Copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 ring-1 ring-primary/30">
              <Tag size={13} className="text-primary" strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                Members-Only Deals
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Train harder.{" "}
              <span className="text-primary">
                Save more.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
              Join the BIAX insider list and get first access to new gear, exclusive
              discounts, and athlete stories delivered straight to your inbox.
            </p>

            {/* Perks list */}
            <ul className="mt-7 space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/40">
                    <ArrowRight size={11} className="text-primary" strokeWidth={3} />
                  </span>
                  <span className="text-xs font-semibold text-neutral-300 sm:text-sm">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm sm:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/40 text-primary">
                  <Mail size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    You&apos;re on the list!
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-neutral-400 sm:text-sm">
                    Here is your exclusive 10% welcome discount code:
                  </p>
                </div>

                {/* THE COUPON CODE CARD */}
                <div className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/10 px-5 py-3 shadow-lg shadow-primary/10">
                  <span className="font-mono text-xl font-black tracking-widest text-primary">
                    BIAX10
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("BIAX10");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-[#b51219] transition active:scale-95 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <span>Copy Code</span>
                    )}
                  </button>
                </div>

                <p className="text-xs text-neutral-400">
                  Use this at <span className="font-bold text-white">Cart</span> or{" "}
                  <span className="font-bold text-white">Checkout</span> for 10% off your order!
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-neutral-950 hover:bg-neutral-200 transition shadow-sm"
                  >
                    Start Shopping Now
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="text-xs font-semibold text-neutral-500 hover:text-white transition"
                  >
                    Subscribe another email
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black uppercase tracking-tight sm:text-xl">
                  Get your welcome discount
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 sm:text-sm">
                  Subscribe and get{" "}
                  <span className="font-black text-primary">10% OFF</span> your
                  first order.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 flex flex-col gap-3 sm:gap-4"
                >
                  <div className="relative">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full rounded-xl border border-white/15 bg-white/10 py-4 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-primary/30 transition duration-300 hover:bg-[#b51219] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        Claim my 10% off
                        <ArrowRight size={16} strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-neutral-600">
                    No spam. Unsubscribe anytime. Your email stays private.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
