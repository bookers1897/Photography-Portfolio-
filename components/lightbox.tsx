"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "@/lib/portfolio";
import { VideoPlayer } from "./video-player";
import { cn } from "@/lib/utils";

type Props = {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onChange }: Props) {
  const open = index !== null;
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const current = index !== null ? items[index] : null;

  const next = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  const prev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, next, prev]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt ?? current.name}
          className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-6 py-4 text-white/80">
            <p className="font-display tracking-[0.2em] text-xs md:text-sm">
              {current.name.toUpperCase()}
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="p-2 -mr-2 hover:opacity-80 transition-transform hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-14">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className={cn(
                "absolute left-2 md:left-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full",
                "bg-white/10 text-white hover:bg-white/25 transition",
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="relative h-full w-full flex items-center justify-center"
              >
                {current.type === "image" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={current.src}
                      alt={current.alt ?? current.name}
                      fill
                      sizes="100vw"
                      quality={95}
                      priority
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <VideoPlayer
                    src={current.src}
                    poster={current.poster}
                    className="w-full max-w-6xl aspect-video"
                    controls
                    preload="auto"
                    muted={false}
                    loop={false}
                    ariaLabel={current.alt ?? current.name}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className={cn(
                "absolute right-2 md:right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full",
                "bg-white/10 text-white hover:bg-white/25 transition",
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-4 text-center text-white/60 text-xs tracking-[0.2em]">
            {current.alt ? (
              <p className="max-w-3xl mx-auto">{current.alt}</p>
            ) : null}
            <p className="mt-2">
              {(index ?? 0) + 1} / {items.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
