
"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images.filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );

  const activeImage = validImages[activeIndex];

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-inner">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-neutral-400">
            <ImageIcon size={48} strokeWidth={1.2} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Product image coming soon
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-neutral-900 shadow-sm backdrop-blur-sm">
          BIAX SPORTS
        </span>
      </div>

      {validImages.length > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-pressed={activeIndex === index}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-neutral-100 transition ${
                activeIndex === index
                  ? "border-primary shadow-sm"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-300"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} image ${index + 1}`}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
