"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { readCart, type CartItem } from "@/lib/cart";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Sportswear", href: "/categories/sportswear" },
  { label: "Martial Arts", href: "/categories/martial-arts-uniforms" },
  { label: "Equipment", href: "/categories/sports-equipment" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const refreshCart = () => setCartItems(readCart());
    refreshCart();
    window.addEventListener("biax-cart-updated", refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener("biax-cart-updated", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-950 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white sm:text-xs">
        BIAX SPORTS — Built for Impact
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-neutral-200 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border-neutral-200 bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-8 sm:py-3 lg:px-12">
          <Link
            href="/"
            className="block w-[115px] shrink-0 sm:w-[150px] lg:w-[170px]"
            aria-label="BIAX SPORTS home"
          >
            <Image
              src="/images/logo.png"
              alt="BIAX SPORTS logo"
              width={400}
              height={150}
              priority
              className="h-auto max-h-[44px] sm:max-h-[54px] w-full object-contain object-left"
              sizes="(max-width: 640px) 115px, (max-width: 1024px) 150px, 170px"
            />
          </Link>

          <nav
            className="hidden items-center gap-0.5 xl:gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative px-2.5 xl:px-3.5 py-2 text-xs xl:text-[13px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    active
                      ? "text-primary"
                      : "text-neutral-700 hover:text-neutral-950"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-2.5 xl:inset-x-3.5 -bottom-0.5 h-0.5 origin-left bg-primary transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              href="/shop"
              className="hidden items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-primary md:inline-flex"
            >
              Shop now
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 sm:h-11 sm:w-auto sm:px-4 items-center justify-center gap-2 rounded-full border border-neutral-200 text-neutral-900 transition hover:border-neutral-900 hover:text-primary active:scale-95"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingBag size={19} />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto flex h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] sm:text-[11px] font-black text-white ring-2 ring-white sm:ring-0 shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition hover:border-neutral-900 hover:bg-neutral-50 active:scale-95 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="absolute inset-x-0 top-full max-h-[calc(100vh-80px)] overflow-y-auto border-t border-neutral-200 bg-white px-6 py-6 pb-12 shadow-2xl lg:hidden custom-scrollbar"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-xl flex-col">
            <div className="flex flex-col divide-y divide-neutral-100">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center justify-between py-4 transition-all duration-200 ${
                      active
                        ? "text-primary"
                        : "text-neutral-950 hover:text-primary active:text-primary"
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black uppercase tracking-tight transition-transform duration-200 group-hover:translate-x-1">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className={`transition-all duration-200 ${
                        active
                          ? "text-primary translate-x-0.5 -translate-y-0.5"
                          : "text-neutral-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-95"
            >
              Shop the collection
              <ArrowUpRight size={18} />
            </Link>

            <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-6 text-xs font-bold uppercase tracking-widest text-neutral-400">
              <span>Biax Sports</span>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-600 transition-colors hover:text-primary"
              >
                Need Help?
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}