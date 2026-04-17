import type { Metadata } from "next";
import { albums, media } from "@/lib/portfolio";
import { MasonryGallery } from "@/components/masonry-gallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected photography and videography work — editorial, beauty, lifestyle, portraits, commissioned, and motion.",
};

export default function WorkPage() {
  return (
    <>
      <header className="container-editorial pt-[calc(var(--header-h)+2rem)] pb-12 md:pb-16">
        <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
          PORTFOLIO
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-wide">
          THE WORK.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg text-[color:var(--color-ink-muted)]">
          Selected frames across editorial, beauty, lifestyle, and motion —
          browse by album or view everything at once.
        </p>
      </header>
      <MasonryGallery items={media} albums={albums} />
    </>
  );
}
