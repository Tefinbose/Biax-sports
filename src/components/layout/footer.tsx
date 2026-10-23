
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-neutral-950 text-white">
      {/* Newsletter / brand statement */}
      <div className="border-b border-white/15">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-12 sm:px-8 md:grid-cols-2 md:items-center lg:px-10 lg:py-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Built for Impact
            </p>
            <h2 className="max-w-xl text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              Train harder.
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_#ffffff] sm:[-webkit-text-stroke:1.5px_#ffffff]">
                Perform better.
              </span>
            </h2>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-md text-sm leading-7 text-neutral-300">
              {siteConfig.tagline} Discover sportswear, martial arts
              uniforms, and equipment made to support your journey.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition duration-300 hover:bg-primary-hover hover:-translate-y-0.5"
            >
              Explore the collection
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 sm:gap-10 sm:px-8 lg:grid-cols-4 lg:px-10 lg:py-16">
        {/* Brand */}
        <div>
          <Link
            href="/"
            aria-label="BIAX SPORTS home"
            className="mb-4 inline-block"
          >
            <Image
              src="/images/logo-white.png"
              alt="BIAX SPORTS"
              width={160}
              height={142}
              className="h-11 w-auto object-contain object-left sm:h-14"
            />
          </Link>

          <p className="max-w-xs text-sm leading-6 sm:leading-7 text-neutral-400">
            {siteConfig.legalName} — an Indian sports brand committed to
            quality, comfort, durability, and performance.
          </p>

          <p className="mt-3 text-xs sm:text-sm font-semibold text-white">
            {siteConfig.slogan}
          </p>
        </div>

        {/* 2-column grid on mobile for Shop & Company */}
        <div className="grid grid-cols-2 gap-6 sm:contents">
          {/* Shop */}
          <div>
            <h3 className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-neutral-200">
              Shop
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/shop"
                  className="text-xs sm:text-sm text-neutral-400 transition hover:text-white"
                >
                  Shop All
                </Link>
              </li>
              {siteConfig.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-xs sm:text-sm text-neutral-400 transition hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-neutral-200">
              Company
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-xs sm:text-sm text-neutral-400 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm text-neutral-400 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}?subject=Order%20Status%20Inquiry`}
                  className="text-xs sm:text-sm text-neutral-400 transition hover:text-white"
                >
                  Order Tracking
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em]">
            Get in touch
          </h3>

          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-red-400" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all text-sm text-neutral-400 transition hover:text-white"
              >
                {siteConfig.email}
              </a>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm leading-6 text-neutral-400">
                {siteConfig.address.line1},
                <br />
                {siteConfig.address.line2},
                <br />
                {siteConfig.address.city}, {siteConfig.address.state}
                <br />
                {siteConfig.address.country} - {siteConfig.address.postalCode}
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-6 text-xs text-neutral-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {currentYear} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>Made for athletes. Built for impact.</p>
            <span className="text-neutral-700">·</span>
            <Link
              href="/admin/login"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
