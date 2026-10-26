"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, ArrowUpRight } from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "sizing" | "compliance" | "orders" | "custom";
  categoryLabel: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    category: "sizing",
    categoryLabel: "Sizing & Fit",
    question: "How do I choose the right size for BIAX Gis and fightwear?",
    answer:
      "All BIAX Gis, rashguards, and combat shorts are tailored according to athletic combat standards with Indian body ergonomics in mind. Every product page contains a detailed height, weight, and chest size chart. If you are between sizes, we generally recommend sizing up for Gis (to account for natural cotton weave settling) or sizing down for compression rashguards for a snug second-skin feel. Plus, our 7-Day Size Exchange on eligible apparel ensures you can easily swap if the fit isn't perfect.",
  },
  {
    id: "faq-2",
    category: "compliance",
    categoryLabel: "Tournament Compliance",
    question: "Are BIAX martial arts uniforms compliant with competition regulations?",
    answer:
      "Yes. Our tournament Gis and combat kits are engineered in compliance with standard national and international martial arts federation specifications (including IBJJF, Judo, and Karate guidelines). They meet regulation collar thickness, sleeve clearance, reinforced lapel stitching, and weave density (GSM) to pass pre-match gear inspection.",
  },
  {
    id: "faq-3",
    category: "orders",
    categoryLabel: "Shipping & Logistics",
    question: "How long does shipping take and where do orders ship from?",
    answer:
      "Orders are dispatched within 24–48 hours directly from our central logistics hub in Kozhikode, Kerala. Standard express delivery takes 2–4 business days across major metros (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad) and 3–6 business days for other regions across 19,000+ PIN codes in India. We offer free shipping on all orders.",
  },
  {
    id: "faq-4",
    category: "orders",
    categoryLabel: "Exchanges & Returns",
    question: "How does the 7-Day Size Exchange policy work?",
    answer:
      "For eligible apparel and martial arts uniforms (Gis, rashguards, fightwear), you can initiate a size exchange within 7 days of delivery if the fit isn't right. Items must be unwashed, unworn, and have original tags intact. We arrange a doorstep reverse pickup across India and dispatch your replacement size once pickup is verified. Non-apparel equipment and accessories follow our standard quality defect warranty.",
  },
  {
    id: "faq-5",
    category: "sizing",
    categoryLabel: "Care Instructions",
    question: "How should I wash and care for my BIAX Gi and sportswear?",
    answer:
      "To maximize the lifespan of your gear: wash inside-out in cold water (30°C max) using mild detergent. Never use bleach or fabric softeners, as they break down synthetic stretch fibers and weaken cotton weave tensile strength. Always hang dry in the shade — avoid tumble dryers, as high heat can shrink cotton Gis and damage sublimated graphics.",
  },
  {
    id: "faq-6",
    category: "custom",
    categoryLabel: "Academies & Bulk Orders",
    question: "Can academies, gyms, and fight clubs order custom branded gear?",
    answer:
      "Yes! We regularly manufacture custom team Gis, rashguards, fight shorts, and tracksuits for martial arts academies, dojos, and clubs across India. We offer custom academy patch embroidery, sublimated academy artwork, and tiered bulk discounts. Reach out via our Contact page or WhatsApp with your team requirements to get a custom mockup and quote.",
  },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "sizing", label: "Sizing & Care" },
  { id: "compliance", label: "Tournament Compliance" },
  { id: "orders", label: "Shipping & Exchanges" },
  { id: "custom", label: "Academy & Custom Orders" },
] as const;

export default function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<string[]>(["faq-1"]);

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) =>
          activeCategory === "sizing"
            ? faq.category === "sizing"
            : activeCategory === "compliance"
            ? faq.category === "compliance"
            : activeCategory === "orders"
            ? faq.category === "orders"
            : faq.category === "custom"
        );

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative overflow-hidden border-t border-neutral-200/80 bg-white py-14 sm:py-20 lg:py-24">
      {/* Subtle architectural background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* SECTION HEADER */}
        <div className="mb-8 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-100 pb-6">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-primary sm:text-xs">
              Common Questions & Answers
            </p>
            <h2 className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Frequently Asked{" "}
              <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <p className="mb-1 text-xs text-neutral-500 sm:text-right font-medium">
              Everything you need to know about gear, fit, and delivery.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:text-primary"
            >
              <span>Need More Help? Contact Support</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="mb-8 flex flex-wrap gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-md shadow-neutral-950/20"
                    : "border border-neutral-200/90 bg-neutral-50/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ACCORDION ITEMS */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-neutral-900 bg-[#fafafa] shadow-md shadow-black/5"
                    : "border-neutral-200/90 bg-white hover:border-neutral-400"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left"
                >
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
                      {faq.categoryLabel}
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight text-neutral-950 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                      isOpen
                        ? "border-primary bg-primary text-white rotate-180"
                        : "border-neutral-200 bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-200/70 px-5 pb-5 pt-3 sm:px-6 sm:pb-6 text-xs sm:text-sm leading-relaxed text-neutral-600 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* QUICK HELP STRIP */}
        <div className="mt-10 sm:mt-14 rounded-2xl border border-neutral-200/90 bg-[#fafafa] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-primary">
              <HelpCircle size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950">
                Still have a question about gear or sizing?
              </h4>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Our athletic specialists in Kerala are active practitioners ready to help you choose the right fit.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary active:scale-95 w-full sm:w-auto"
            >
              <MessageCircle size={14} />
              <span>Contact Gear Specialists</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
