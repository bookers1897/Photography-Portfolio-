import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getHeroImage } from "@/lib/portfolio";

const FALLBACK_HERO_SRC =
  "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=2400&q=95&auto=format&fit=max";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Book & Capture — a photography and videography studio crafting editorial, beauty, and motion work for people and brands.",
};

const pillars = [
  {
    n: "01",
    title: "INTENT",
    body: "Every project begins with a conversation — about the story, the feeling, and where the work belongs in the world.",
  },
  {
    n: "02",
    title: "CRAFT",
    body: "Light, wardrobe, and movement are tuned frame by frame. Prints, files, and cuts are finished with care.",
  },
  {
    n: "03",
    title: "PARTNERSHIP",
    body: "We work closely with creative directors, producers, and talent — collaborative on set and generous with revisions.",
  },
];

export default async function AboutPage() {
  const hero = await getHeroImage();
  const heroSrc = hero?.src ?? FALLBACK_HERO_SRC;

  return (
    <>
      <section className="container-editorial pt-[calc(var(--header-h)+2rem)] pb-12 md:pb-16">
        <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
          STUDIO
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-wide max-w-[14ch]">
          MADE WITH A QUIET, DELIBERATE HAND.
        </h1>
      </section>

      <section className="container-editorial grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16 pb-24 md:pb-32 items-start">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--color-surface)]">
          <Image
            src={heroSrc}
            alt="Photographer at work"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={90}
            className="object-cover"
          />
        </div>
        <div className="font-serif text-lg leading-relaxed text-[color:var(--color-ink)]/90 space-y-6">
          <p>
            Book &amp; Capture is a boutique photography and videography
            practice making editorial, beauty, lifestyle, and motion work for
            people and brands — worldwide booking.
          </p>
          <p>
            We gravitate toward warm, honest light and images that carry a
            sense of place. Our work has lived on magazine pages, campaign
            hubs, and framed above people&apos;s beds.
          </p>
          <p>
            Based in the United States. Available for travel.
          </p>
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center gap-2 font-display tracking-[0.2em] text-sm border-b border-current pb-1 hover:opacity-70 transition"
          >
            START A PROJECT <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      <section className="container-editorial pb-24 md:pb-32 border-t border-[color:var(--color-border)] pt-16">
        <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-10">
          HOW WE WORK
        </p>
        <ul className="grid md:grid-cols-3 gap-10">
          {pillars.map((p) => (
            <li key={p.n} className="flex flex-col gap-3">
              <span className="font-display text-xs tracking-[0.3em] opacity-60">
                {p.n}
              </span>
              <h3 className="font-display text-3xl tracking-wide">{p.title}</h3>
              <p className="font-serif text-[color:var(--color-ink-muted)] leading-relaxed">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-editorial pb-24 md:pb-32 border-t border-[color:var(--color-border)] pt-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
              SERVICES
            </p>
            <ul className="font-display text-2xl md:text-3xl tracking-wide space-y-3">
              <li>EDITORIAL PHOTOGRAPHY</li>
              <li>BEAUTY &amp; CAMPAIGN</li>
              <li>LIFESTYLE &amp; PORTRAITURE</li>
              <li>SHORT-FORM MOTION</li>
              <li>BRAND FILMS</li>
            </ul>
          </div>
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
              SELECTED CLIENTS
            </p>
            <ul className="font-serif text-lg text-[color:var(--color-ink-muted)] space-y-2">
              <li>Independent magazines &amp; editorial titles</li>
              <li>Beauty and wellness brands</li>
              <li>Fashion and lifestyle labels</li>
              <li>Talent representation &amp; agencies</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
