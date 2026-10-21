import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact BIAX SPORTS INDIA PRIVATE LIMITED. Get support for orders, custom martial arts uniforms, sportswear queries, and wholesale inquiries.",
};

const faqs = [
  {
    q: "How long does shipping take across India?",
    a: "Orders are dispatched within 24–48 business hours from our hub in Kerala. Standard delivery takes 3–7 business days depending on your delivery location.",
  },
  {
    q: "Do you supply custom uniforms for martial arts academies and dojos?",
    a: "Yes! We specialize in custom Gis and training gear for karate, judo, taekwondo, and MMA academies with club logo embroidery and bulk pricing tiers.",
  },
  {
    q: "Can I exchange an item if the size doesn't fit?",
    a: "Absolutely. Items in original, unwashed condition with tags intact can be exchanged for an alternate size within 7 days of delivery.",
  },
  {
    q: "How can I track my existing order?",
    a: "Once shipped, tracking details are sent via email and SMS. You can also contact our team directly at info@biaxsports.com with your Order ID.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-neutral-950 px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_46px,rgba(255,255,255,0.04)_46px_48px)]" />
        <div className="absolute -right-36 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-36 -left-36 -z-10 h-[400px] w-[400px] rounded-full border border-white/10" />

        <div className="mx-auto max-w-[1440px]">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur sm:text-xs">
            Support & Inquiries
          </div>

          <h1 className="mt-6 text-2xl font-black uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            Get in{" "}
            <span className="text-transparent [-webkit-text-stroke:1.2px_#ffffff] sm:[-webkit-text-stroke:1.8px_#ffffff]">
              touch.
            </span>
            <br />
            We&apos;re here to{" "}
            <span className="text-primary">help.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base sm:leading-7">
            Have a question about our sportswear, martial arts gear, sizing, or custom academy
            orders? Send us a message or reach out via our official communication channels.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT: STICKY FORM (LEFT) + SCROLLABLE INFO & FAQS (RIGHT) */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-start">
          {/* LEFT: STICKY CONTACT FORM */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
            <ContactForm />
          </div>

          {/* RIGHT: SCROLLABLE DIRECTORY, DETAILS & FAQS */}
          <div className="space-y-4 lg:col-span-5 lg:max-h-[660px] lg:overflow-y-auto custom-scrollbar lg:pr-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Contact Directory & Help
              </span>
              <span className="hidden text-[10px] font-semibold text-primary lg:inline">
                Scroll for more cards & FAQs ↓
              </span>
            </div>

            {/* Direct Email Card */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-primary">
                <Mail size={20} />
              </div>
              <h3 className="mt-4 text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                Email Support
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Our support team typically replies within 24 business hours.
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 inline-block text-sm font-bold text-primary transition hover:underline"
              >
                {siteConfig.email}
              </a>
            </div>

            {/* Address Card */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                <MapPin size={20} />
              </div>
              <h3 className="mt-4 text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                Headquarters & Office
              </h3>
              <p className="mt-1 text-xs font-semibold text-neutral-700">
                {siteConfig.legalName}
              </p>
              <address className="mt-2 text-xs not-italic leading-5 text-neutral-500">
                {siteConfig.address.line1}, {siteConfig.address.line2}
                <br />
                {siteConfig.address.city}, {siteConfig.address.state}
                <br />
                {siteConfig.address.country} - {siteConfig.address.postalCode}
              </address>
            </div>

            {/* Operating Hours */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                <Clock size={20} />
              </div>
              <h3 className="mt-4 text-base font-black uppercase tracking-tight text-neutral-950 sm:text-lg">
                Business Hours
              </h3>
              <div className="mt-3 space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Monday – Saturday</span>
                  <span className="font-semibold text-neutral-900">9:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-neutral-400">Closed</span>
                </div>
              </div>
            </div>

            {/* Academy / Bulk Orders Card */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-neutral-950 to-neutral-900 p-6 text-white shadow-sm sm:p-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Package size={15} />
                Bulk & Academy Orders
              </div>
              <h4 className="mt-2 text-lg font-black uppercase">
                Equipping a Club or Dojo?
              </h4>
              <p className="mt-1.5 text-xs leading-5 text-neutral-300">
                We manufacture bespoke uniforms, Gis, and athletic kits with customized logo
                embroidery and discounted academy rates.
              </p>
              <a
                href={`mailto:${siteConfig.email}?subject=Academy%20Bulk%20Order%20Inquiry`}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary-hover"
              >
                Inquire for Academy
              </a>
            </div>

            {/* Embedded FAQs in scrollable section */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Quick Answers (FAQs)
              </span>
            </div>

            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-50 text-[11px] font-bold text-primary">
                    ?
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 sm:text-sm">
                      {faq.q}
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-neutral-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
