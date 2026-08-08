"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/data";

interface AssetGalleryProps {
  images: GalleryImage[];
  aspectRatio?: "square" | "video";
}

export function AssetGallery({ images, aspectRatio = "square" }: AssetGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Main image */}
      <div
        className={`relative rounded-lg overflow-hidden bg-bg-secondary border border-border-glass ${
          aspectRatio === "video" ? "aspect-video" : "aspect-square"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active.src}
            src={active.src}
            alt={active.label || "Asset render"}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Wireframe label */}
        {active.wireframe && (
          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-[9px] font-bold border border-accent-cyan/20">
            Wireframe
          </span>
        )}

        {/* Image label */}
        {active.label && !active.wireframe && images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-bg-surface/80 text-text-muted text-[9px] border border-border-glass">
            {active.label}
          </span>
        )}

        {/* Prev/Next arrows — only show when gallery has 2+ images */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-surface/80 border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-cyan transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev + 1) % images.length);
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-surface/80 border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-cyan transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={12} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — show when 2+ images */}
      {images.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
              }}
              className={`relative shrink-0 w-10 h-10 rounded border overflow-hidden cursor-pointer transition-all ${
                i === activeIndex
                  ? "border-accent-cyan/50 ring-1 ring-accent-cyan/30"
                  : "border-border-glass opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.src} alt={img.label || ""} className="w-full h-full object-cover" />
              {img.wireframe && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[6px] text-accent-cyan bg-bg-surface/80 leading-none py-px">
                  W
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
