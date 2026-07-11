"use client";

import { useState } from "react";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import type { GalleryImage } from "@/lib/data/gallery";

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(image)}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <FaXmark size={18} />
          </button>
          <div className="relative aspect-[4/3] w-full max-w-3xl">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="90vw"
              className="rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
