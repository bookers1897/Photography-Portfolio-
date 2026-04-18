"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Album, MediaItem } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Slide = { album: Album; cover: MediaItem };

export function FeaturedStrip({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!slides.length || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  if (!slides.length) return null;

  return (
    <section
      aria-label="Album slideshow"
      className="border-t border-[color:var(--color-border)]"
    >
      <div
        className="relative w-full aspect-[3/2] md:aspect-[16/9] overflow-hidden bg-[color:var(--color-surface)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => (
          <Link
            key={s.album.id}
            href={`/work/${s.album.slug}`}
            aria-label={`Open ${s.album.name} album`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={cn(
              "group absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
              i === index
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
          >
            <Image
              src={s.cover.src}
              alt={s.cover.alt ?? s.cover.name}
              fill
              priority={i === 0}
              quality={90}
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            />
            <span className="absolute left-6 bottom-6 md:left-10 md:bottom-10 text-white">
              <span className="block font-display tracking-[0.3em] text-xs opacity-85 mb-2">
                ALBUM
              </span>
              <span className="block font-display tracking-[0.05em] text-3xl md:text-5xl leading-none">
                {s.album.name.toUpperCase()}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="Slideshow navigation"
        className="flex items-center justify-center gap-2 py-5"
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
    </section>
  );
}
