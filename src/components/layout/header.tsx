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
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="block w-[130px] shrink-0 sm:w-[160px] lg:w-[180px]"
            aria-label="BIAX SPORTS home"
          >
            <Image
              src="/images/logo.png"
              alt="BIAX SPORTS logo"
              width={400}
              height={150}
              priority
              className="h-auto max-h-[56px] w-full object-contain object-left"
              sizes="(max-width: 640px) 130px, (max-width: 1024px) 160px, 180px"
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

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/shop"
              className="hidden items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-primary md:inline-flex"
            >
              Shop now
              <ArrowUpRight size={15} />
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 text-sm font-bold text-neutral-900 transition hover:border-primary hover:text-primary"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingBag size={19} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition hover:bg-neutral-50 lg:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="absolute inset-x-0 top-full max-h-[calc(100vh-90px)] overflow-y-auto border-t border-neutral-200 bg-white px-5 py-6 pb-14 shadow-2xl lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-xl flex-col">
            {navigation.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between border-b border-neutral-100 py-3.5 text-lg sm:text-xl font-black uppercase tracking-tight transition-colors ${
                  isActive(item.href) ? "text-primary" : "text-neutral-950 active:text-primary"
                }`}
              >
                <span>
                  <span className="mr-3 text-xs font-bold tracking-[0.2em] text-neutral-400">
                    0{i + 1}
                  </span>
                  {item.label}
                </span>
                <ArrowUpRight size={18} className="text-neutral-300" />
              </Link>
            ))}
            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-lg shadow-primary/25 active:scale-95"
            >
              Shop the collection
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}