import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Album, MediaItem } from "@/lib/brand";

type Slide = { album: Album; cover: MediaItem };

export function AlbumCardGrid({ slides }: { slides: Slide[] }) {
  if (!slides.length) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {slides.map(({ album, cover }) => (
        <li key={album.id}>
          <Link
            href={`/work/${album.slug}`}
            aria-label={`Open ${album.name} album`}
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)]">
              <Image
                src={cover.src}
                alt={cover.alt ?? cover.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={88}
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
              />
              <span className="absolute left-5 right-5 bottom-5 text-white">
                <span className="block font-display tracking-[0.25em] text-[10px] opacity-85 mb-1">
                  ALBUM
                </span>
                <span className="font-display tracking-[0.05em] text-2xl md:text-3xl leading-none flex items-center gap-2">
                  {album.name.toUpperCase()}
                  <ArrowUpRight
                    className="h-5 w-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition duration-300"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
            </div>
            {album.description && (
              <p className="mt-3 text-sm font-serif italic text-[color:var(--color-ink-muted)] line-clamp-2">
                {album.description}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
