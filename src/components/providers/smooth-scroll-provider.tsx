"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    // Use lerp damping for zero-stutter, highly responsive scrolling that never gets stuck
    const lenis = new Lenis({
      lerp: 0.1, // Fluid spring damping (never feels heavy or sticky)
      smoothWheel: true,
      wheelMultiplier: 1.0,
      autoRaf: true, // Native internal rAF loop perfectly synced with display refresh rate
      anchors: true, // Seamless anchor link scrolling
      allowNestedScroll: true, // Prevents scroll locking over carousels/nested elements
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Expose lenis globally for any component needing custom scroll targeting
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Refresh dimensions whenever images finish loading or dynamic sections resize
    const handleResize = () => lenis.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // When route changes, reset scroll position immediately to top
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
