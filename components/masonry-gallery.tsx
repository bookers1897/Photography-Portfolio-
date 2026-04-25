"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { MediaItem, Album } from "@/lib/brand";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

type Props = {
  items: MediaItem[];
  albums?: Album[];
  activeSlug?: string;
};

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

  const columnsDesktop = useMemo(() => packColumns(items, 3), [items]);
  const columnsMobile = useMemo(() => packColumns(items, 2), [items]);

  return (
    <div className="container-editorial pb-24">
      {albums && albums.length > 0 && (
        <nav
          aria-label="Album filters"
          className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto mb-8 md:mb-10"
        >
          <ul className="flex items-center gap-x-5 md:gap-x-6 gap-y-2 font-display text-xs md:text-sm tracking-[0.2em] whitespace-nowrap">
            <li>
              <Link
                href="/work"
                className={cn(
                  "py-2 inline-block transition-opacity",
                  !activeSlug
                    ? "opacity-100 underline underline-offset-8 decoration-[color:var(--color-ink)]"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                ALL
              </Link>
            </li>
            {albums.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/work/${a.slug}`}
                  className={cn(
                    "py-2 inline-block transition-opacity",
                    activeSlug === a.slug
                      ? "opacity-100 underline underline-offset-8 decoration-[color:var(--color-ink)]"
                      : "opacity-60 hover:opacity-100",
                  )}
                >
                  {a.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {items.length === 0 ? (
        <p className="py-20 text-center font-display tracking-[0.2em] text-sm opacity-60">
          NO WORK YET IN THIS ALBUM.
        </p>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-3 gap-4">
            {columnsDesktop.map((col, ci) => (
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

          <div className="md:hidden grid grid-cols-2 gap-2">
            {columnsMobile.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-2">
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
    <button
      type="button"
      onClick={onClick}
      className="group relative block w-full overflow-hidden bg-[color:var(--color-surface)]"
      aria-label={`Open ${item.name}`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt={item.alt ?? item.name}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
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
    </button>
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
          sizes="(min-width: 768px) 33vw, 50vw"
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
