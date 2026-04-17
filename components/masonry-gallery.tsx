"use client";

import { useMemo, useState } from "react";
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

export function MasonryGallery({ items, albums, activeSlug }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const columns = useMemo(() => {
    const cols: MediaItem[][] = [[], [], []];
    items.forEach((item, i) => {
      cols[i % 3].push(item);
    });
    return cols;
  }, [items]);

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
  const aspect = item.height / item.width;
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
      ) : item.poster ? (
        <Image
          src={item.poster}
          alt={item.alt ?? item.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          quality={90}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="absolute inset-0 bg-black"
          style={{ aspectRatio: 1 / aspect }}
        />
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {item.type === "video" && (
        <span
          aria-hidden
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm px-3 py-1 text-[10px] tracking-[0.2em] text-white font-display"
        >
          <Play className="h-3 w-3" /> VIDEO
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
