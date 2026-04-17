"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { MediaItem, Album } from "@/lib/portfolio";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

type Props = {
  items: MediaItem[];
  albums?: Album[];
  activeSlug?: string;
};

const COLUMN_COUNT = 3;

function packColumns(items: MediaItem[], cols: number) {
  const heights = new Array(cols).fill(0);
  const buckets: MediaItem[][] = Array.from({ length: cols }, () => []);
  for (const item of items) {
    const ratio = item.height / item.width;
    let shortest = 0;
    for (let i = 1; i < cols; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    buckets[shortest].push(item);
    heights[shortest] += ratio;
  }
  return buckets;
}

export function MasonryGallery({ items, albums, activeSlug }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const columns = useMemo(() => packColumns(items, COLUMN_COUNT), [items]);

  return (
    <div className="container-editorial pb-24">
      {albums && albums.length > 0 && (
        <nav
          aria-label="Album filters"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 font-display text-xs md:text-sm tracking-[0.2em]"
        >
          <Link
            href="/work"
            className={cn(
              "py-1 transition-opacity",
              !activeSlug
                ? "opacity-100 underline underline-offset-8 decoration-[color:var(--color-ink)]"
                : "opacity-60 hover:opacity-100",
            )}
          >
            ALL
          </Link>
          {albums.map((a) => (
            <Link
              key={a.slug}
              href={`/work/${a.slug}`}
              className={cn(
                "py-1 transition-opacity",
                activeSlug === a.slug
                  ? "opacity-100 underline underline-offset-8 decoration-[color:var(--color-ink)]"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              {a.name.toUpperCase()}
            </Link>
          ))}
        </nav>
      )}

      {items.length === 0 ? (
        <p className="py-20 text-center font-display tracking-[0.2em] text-sm opacity-60">
          NO WORK YET IN THIS ALBUM.
        </p>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-3 gap-4">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                {col.map((item) => {
                  const absoluteIndex = items.indexOf(item);
                  return (
                    <Tile
                      key={item.id}
                      item={item}
                      onClick={() => setOpenIndex(absoluteIndex)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            {items.map((item, i) => (
              <Tile
                key={item.id}
                item={item}
                onClick={() => setOpenIndex(i)}
              />
            ))}
          </div>
        </>
      )}

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
      />
    </div>
  );
}

function Tile({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="group relative block w-full overflow-hidden bg-[color:var(--color-surface)]"
      aria-label={`Open ${item.name}`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt={item.alt ?? item.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          quality={90}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
        />
      ) : (
        <VideoTile item={item} />
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {item.type === "video" && (
        <span
          aria-hidden
          className="absolute top-3 right-3 inline-flex items-center justify-center h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Play className="h-3 w-3 translate-x-[1px]" strokeWidth={1.5} />
        </span>
      )}

      <span className="absolute left-4 bottom-4 right-4 text-left text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
        <span className="block font-display tracking-[0.2em] text-xs">
          {item.name.toUpperCase()}
        </span>
      </span>
    </motion.button>
  );
}

function VideoTile({ item }: { item: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterVisible, setPosterVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) io.disconnect();

    return () => io.disconnect();
  }, []);

  return (
    <>
      {item.poster && posterVisible && (
        <Image
          src={item.poster}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          quality={85}
          className="object-cover"
        />
      )}
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.alt ?? item.name}
        onPlaying={() => setPosterVisible(false)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
      />
    </>
  );
}
