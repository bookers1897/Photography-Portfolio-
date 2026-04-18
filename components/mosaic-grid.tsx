import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/brand";

const COLS = 3;

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

export function MosaicGrid({ items }: { items: MediaItem[] }) {
  if (!items.length) return null;
  const columns = packColumns(items, COLS);

  return (
    <div className="container-editorial pb-24">
      <div className="hidden md:grid grid-cols-3 gap-4">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-4">
            {col.map((item) => (
              <Tile key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
      <div className="md:hidden grid grid-cols-1 gap-4">
        {items.map((item) => (
          <Tile key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function Tile({ item }: { item: MediaItem }) {
  const href = item.albumSlug ? `/work/${item.albumSlug}` : "/work";
  return (
    <Link
      href={href}
      aria-label={`View ${item.name}`}
      className="group relative block w-full overflow-hidden bg-[color:var(--color-surface)]"
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      <Image
        src={item.src}
        alt={item.alt ?? item.name}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        quality={85}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <span className="absolute left-4 bottom-4 right-4 text-left text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
        <span className="block font-display tracking-[0.2em] text-xs">
          {item.name.toUpperCase()}
        </span>
      </span>
    </Link>
  );
}
