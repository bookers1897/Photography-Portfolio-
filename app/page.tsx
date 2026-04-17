import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  getAllAlbums,
  getFeaturedMedia,
  getHeroImage,
} from "@/lib/portfolio";
import { FeaturedStrip } from "@/components/featured-strip";

const FALLBACK_HERO = {
  src: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=2400&q=95&auto=format&fit=max",
  alt: "Featured editorial portrait in warm natural light.",
};

export default async function HomePage() {
  const [albums, featured, hero] = await Promise.all([
    getAllAlbums(),
    getFeaturedMedia(6),
    getHeroImage(),
  ]);

  const heroSrc = hero?.src ?? FALLBACK_HERO.src;
  const heroAlt = hero?.alt ?? hero?.name ?? FALLBACK_HERO.alt;

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
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/55"
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

      {featured.length > 0 && <FeaturedStrip items={featured} />}

      {albums.length > 0 && (
        <section className="container-editorial py-24 md:py-32 border-t border-[color:var(--color-border)]">
          <div className="flex items-end justify-between mb-10 md:mb-14 gap-6 flex-wrap">
            <div>
              <p className="font-display text-xs tracking-[0.3em] opacity-70 mb-4">
                02 — ALBUMS
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
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--color-border)] border border-[color:var(--color-border)]">
            {albums.map((a) => (
              <li key={a.id} className="bg-[color:var(--color-bg)]">
                <Link
                  href={`/work/${a.slug}`}
                  className="group flex flex-col gap-3 p-8 md:p-10 h-full hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <span className="font-display text-3xl md:text-4xl tracking-wide">
                    {a.name.toUpperCase()}
                  </span>
                  {a.description && (
                    <span className="text-sm text-[color:var(--color-ink-muted)] font-serif italic">
                      {a.description}
                    </span>
                  )}
                  <span className="mt-auto pt-6 font-display text-xs tracking-[0.3em] inline-flex items-center gap-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition">
                    VIEW <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
