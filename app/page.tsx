import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  getAlbumSlides,
  getHeroImage,
  getMosaicMedia,
} from "@/lib/portfolio";
import { FeaturedStrip } from "@/components/featured-strip";
import { MosaicGrid } from "@/components/mosaic-grid";
import { AlbumCardGrid } from "@/components/album-card-grid";

const FALLBACK_HERO = {
  src: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=2400&q=95&auto=format&fit=max",
  alt: "Featured editorial portrait in warm natural light.",
};

export default async function HomePage() {
  const [slides, mosaic, hero] = await Promise.all([
    getAlbumSlides(),
    getMosaicMedia(12),
    getHeroImage(),
  ]);

  const heroSrc = hero?.src ?? FALLBACK_HERO.src;
  const heroAlt = hero?.alt ?? hero?.name ?? FALLBACK_HERO.alt;
  const focalX = hero?.focalX ?? 50;
  const focalY = hero?.focalY ?? 50;
  const overlay = hero?.overlay ?? 0.35;

  return (
    <>
      <section
        className="relative h-[100dvh] w-full overflow-hidden -mt-[var(--header-h)]"
        aria-label="Featured work"
      >
        <Image
          src={heroSrc}
          alt={heroAlt}
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
        />
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlay }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"
          aria-hidden
        />
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 text-white">
          <p className="font-display tracking-[0.3em] text-xs md:text-sm mb-6 opacity-85">
            PHOTOGRAPHY · VIDEOGRAPHY
          </p>
          <h1 className="font-display leading-[0.9] tracking-wide text-[15vw] md:text-[10vw] lg:text-[8.5rem] max-w-[14ch]">
            BOOK &amp; CAPTURE
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg opacity-90 font-serif italic">
            Editorial, beauty, and motion work — stories made to feel and last.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 font-display tracking-[0.2em] text-sm">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-white/90 transition"
            >
              VIEW WORK <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/80 hover:bg-white/10 transition"
            >
              BOOK A SESSION
            </Link>
          </div>
        </div>
      </section>

      <section className="container-editorial py-24 md:py-32">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-end">
          <div>
            <p className="font-display text-xs tracking-[0.3em] opacity-70 mb-4">
              01 — APPROACH
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide">
              MADE TO
              <br />
              FEEL REAL.
            </h2>
          </div>
          <p className="font-serif text-lg md:text-xl leading-relaxed text-[color:var(--color-ink-muted)]">
            Book &amp; Capture crafts visual narratives for people and brands —
            editorial portraits, beauty campaigns, lifestyle films, and
            documentary moments. Every frame is built with intent, tuned for
            light, and finished with care.
          </p>
        </div>
      </section>

      {slides.length > 0 && (
        <section className="container-editorial pb-16 md:pb-24 border-t border-[color:var(--color-border)] pt-16 md:pt-24">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10 md:mb-14">
            <div>
              <p className="font-display text-xs tracking-[0.3em] opacity-70 mb-4">
                02 — ALBUMS
              </p>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide">
                BROWSE
                <br />
                BY ALBUM.
              </h2>
            </div>
            <Link
              href="/work"
              className="font-display tracking-[0.2em] text-sm inline-flex items-center gap-2 hover:opacity-70 transition"
            >
              SEE ALL <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <AlbumCardGrid slides={slides} />
        </section>
      )}

      {slides.length > 0 && <FeaturedStrip slides={slides} />}

      {mosaic.length > 0 && (
        <section className="border-t border-[color:var(--color-border)] pt-24 md:pt-32">
          <div className="container-editorial mb-10 md:mb-14 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-display text-xs tracking-[0.3em] opacity-70 mb-4">
                03 — SELECTED FRAMES
              </p>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide">
                EXPLORE
                <br />
                THE WORK.
              </h2>
            </div>
            <Link
              href="/work"
              className="font-display tracking-[0.2em] text-sm inline-flex items-center gap-2 hover:opacity-70 transition"
            >
              SEE ALL <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <MosaicGrid items={mosaic} />
        </section>
      )}

      <section className="container-editorial py-24 md:py-32 border-t border-[color:var(--color-border)]">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <p className="font-display text-xs tracking-[0.3em] opacity-70">
            LET&apos;S CREATE
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-wide">
            READY TO
            <br />
            BOOK?
          </h2>
          <p className="font-serif text-lg text-[color:var(--color-ink-muted)]">
            Commercial projects, editorial stories, and personal sessions
            worldwide. Tell us about your vision and we&apos;ll take it from
            there.
          </p>
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 bg-[color:var(--color-ink)] text-[color:var(--color-bg)] font-display tracking-[0.2em] text-sm hover:opacity-90 transition"
          >
            GET IN TOUCH <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </>
  );
}
