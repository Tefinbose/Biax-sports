"use client";

import Image from "next/image";
import { useState, useRef, TouchEvent } from "react";
import {
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const validImages = images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0
  );

  const hasMultiple = validImages.length > 1;
  const activeImage = validImages[activeIndex] || validImages[0];

  function handlePrev() {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  }

  function handleNext() {
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  }

  return (
    <div className="mx-auto w-full max-w-[500px]">
      {/* MAIN IMAGE CONTAINER */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-sm border border-neutral-200/80"
      >
        {activeImage ? (
          <>
            <Image
              src={activeImage}
              alt={`${productName} - Photo ${activeIndex + 1}`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Click to open fullscreen lightbox overlay */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="View full screen image"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-sm backdrop-blur-sm transition-all hover:bg-neutral-950 hover:text-white"
            >
              <Maximize2 size={16} />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
            <ImageIcon size={44} strokeWidth={1.2} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Product image coming soon
            </span>
          </div>
        )}

        {/* Brand Badge */}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-900 shadow-xs backdrop-blur-sm">
          BIAX SPORTS
        </span>

        {/* Image Counter Badge when multiple images exist */}
        {hasMultiple && (
          <span className="absolute bottom-3.5 right-3.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-mono font-bold tracking-wider text-white backdrop-blur-sm">
            {activeIndex + 1} / {validImages.length}
          </span>
        )}

        {/* Prev / Next Navigation Arrows (Visible on hover on desktop, always responsive) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-neutral-950 hover:text-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-neutral-950 hover:text-white md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAIL RAIL (Enhanced when multiple images exist) */}
      {hasMultiple && (
        <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {validImages.map((image, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Select photo ${index + 1}`}
                aria-pressed={isSelected}
                className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition duration-200 ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 shadow-md scale-102"
                    : "border-neutral-200/90 bg-neutral-100 opacity-70 hover:opacity-100 hover:border-neutral-400"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <div
            className="relative h-[85vh] w-[90vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`${productName} fullscreen`}
              fill
              unoptimized
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-mono font-bold text-white tracking-widest backdrop-blur-sm">
                {activeIndex + 1} / {validImages.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
