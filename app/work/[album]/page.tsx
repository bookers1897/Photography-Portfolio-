import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { albums, getAlbumBySlug, getMediaForAlbum } from "@/lib/portfolio";
import { MasonryGallery } from "@/components/masonry-gallery";

type Params = Promise<{ album: string }>;

export function generateStaticParams() {
  return albums.map((a) => ({ album: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { album } = await params;
  const found = getAlbumBySlug(album);
  if (!found) return { title: "Album" };
  return {
    title: found.name,
    description: found.description ?? `${found.name} portfolio album.`,
  };
}

export default async function AlbumPage({ params }: { params: Params }) {
  const { album } = await params;
  const found = getAlbumBySlug(album);
  if (!found) notFound();

  const items = getMediaForAlbum(found.slug);

  return (
    <>
      <header className="container-editorial pt-[calc(var(--header-h)+2rem)] pb-12 md:pb-16">
        <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
          ALBUM
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-wide">
          {found.name.toUpperCase()}.
        </h1>
        {found.description && (
          <p className="mt-6 max-w-2xl font-serif text-lg text-[color:var(--color-ink-muted)]">
            {found.description}
          </p>
        )}
      </header>
      <MasonryGallery items={items} albums={albums} activeSlug={found.slug} />
    </>
  );
}
