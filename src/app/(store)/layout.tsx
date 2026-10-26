import { Suspense, type ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50">
      <div className="relative overflow-hidden bg-neutral-950 py-2 text-white border-b border-neutral-900 select-none">
        <div className="flex w-max animate-marquee items-center gap-6 sm:gap-8 text-[10px] font-bold uppercase tracking-[0.22em] sm:text-xs">
          {[
            { text: "BIAX SPORTS — Built for Impact" },
            { text: "WELCOME OFFER: FLAT ₹500 OFF", code: "WELCOME500" },
            { text: "GET 10% OFF YOUR FIRST ORDER", code: "BIAX10" },
            { text: "FREE PAN-INDIA DELIVERY ON PREPAID ORDERS" },
            { text: "BUILT FOR INTENSE TRAINING" },
          ].concat([
            { text: "BIAX SPORTS — Built for Impact" },
            { text: "WELCOME OFFER: FLAT ₹500 OFF", code: "WELCOME500" },
            { text: "GET 10% OFF YOUR FIRST ORDER", code: "BIAX10" },
            { text: "FREE PAN-INDIA DELIVERY ON PREPAID ORDERS" },
            { text: "BUILT FOR INTENSE TRAINING" },
          ]).map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <span>{item.text}</span>
                {item.code && (
                  <span className="inline-flex items-center gap-1 rounded bg-primary/25 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-primary border border-primary/40">
                    {item.code}
                  </span>
                )}
              </span>
              <span className="text-neutral-500 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="h-9 w-32 rounded-lg bg-neutral-100 animate-pulse" />
          <div className="hidden lg:flex gap-6">
            <div className="h-4 w-12 rounded bg-neutral-100 animate-pulse" />
            <div className="h-4 w-12 rounded bg-neutral-100 animate-pulse" />
            <div className="h-4 w-12 rounded bg-neutral-100 animate-pulse" />
          </div>
          <div className="h-10 w-24 rounded-full bg-neutral-100 animate-pulse" />
        </div>
      </div>
    </header>
  );
}

export default function StoreLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
