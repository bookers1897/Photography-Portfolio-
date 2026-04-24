"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type PanInfo,
  useReducedMotion,
} from "motion/react";
import type { Album, MediaItem } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Slide = { album: Album; cover: MediaItem };

const AUTOPLAY_MS = 5500;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

export function FeaturedStrip({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const draggingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!slides.length || paused || prefersReducedMotion) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, paused, prefersReducedMotion]);

  if (!slides.length) return null;

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    draggingRef.current = false;
    setPaused(false);
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) {
      next();
    } else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) {
      prev();
    }
  };

  const current = slides[index];

  return (
    <section
      aria-label="Featured albums slideshow"
      className="border-t border-[color:var(--color-border)] py-10 md:py-14"
    >
      <div className="container-editorial">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-6 md:mb-10">
          <div>
            <p className="font-display text-xs tracking-[0.3em] opacity-70 mb-3">
              FEATURED
            </p>
            <h2 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-wide">
              IN THE SPOTLIGHT.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-ink)]/20 hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bg)] transition"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-ink)]/20 hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bg)] transition"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          className="relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-[color:var(--color-surface)] rounded-xl md:rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={current.album.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => {
                draggingRef.current = true;
                setPaused(true);
              }}
              onDragEnd={onDragEnd}
            >
              <Link
                href={`/work/${current.album.slug}`}
                aria-label={`Open ${current.album.name} album`}
                onClick={(e) => {
                  if (draggingRef.current) e.preventDefault();
                }}
                className="group block h-full w-full"
                draggable={false}
              >
                <Image
                  src={current.cover.src}
                  alt={current.cover.alt ?? current.cover.name}
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-cover pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
                  draggable={false}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
                />
                <span className="absolute left-6 right-6 bottom-6 md:left-10 md:bottom-10 md:right-10 text-white">
                  <span className="block font-display tracking-[0.3em] text-[11px] md:text-xs opacity-85 mb-2 md:mb-3">
                    ALBUM
                  </span>
                  <span className="block font-display tracking-[0.05em] text-3xl md:text-5xl lg:text-6xl leading-none">
                    {current.album.name.toUpperCase()}
                  </span>
                  {current.album.description && (
                    <span className="hidden md:block mt-3 text-sm font-serif italic max-w-xl opacity-90">
                      {current.album.description}
                    </span>
                  )}
                  <span className="mt-4 md:mt-6 inline-flex items-center gap-2 font-display tracking-[0.2em] text-[11px] md:text-xs">
                    VIEW ALBUM
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          role="tablist"
          aria-label="Slideshow navigation"
          className="flex items-center justify-center gap-2 pt-5 md:pt-6"
        >
          {slides.map((s, i) => (
            <button
              key={s.album.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${s.album.name}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-[3px] transition-all duration-300",
                i === index
                  ? "w-10 bg-[color:var(--color-ink)]"
                  : "w-5 bg-[color:var(--color-ink)]/30 hover:bg-[color:var(--color-ink)]/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
