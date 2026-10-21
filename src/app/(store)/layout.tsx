import { Suspense, type ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-neutral-950 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white sm:text-xs">
        BIAX SPORTS — Built for Impact
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
