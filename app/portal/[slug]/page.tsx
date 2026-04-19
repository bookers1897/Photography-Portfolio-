import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getClientAlbumBySlug,
  getMediaForClientAlbum,
} from "@/lib/portfolio";
import { MasonryGallery } from "@/components/masonry-gallery";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export const metadata: Metadata = {
  title: "Private Session",
  robots: { index: false, follow: false },
};

function formatExpiry(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PortalAlbumPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const album = await getClientAlbumBySlug(slug, user.id);
  if (!album) notFound();

  const items = await getMediaForClientAlbum(album.id);
  const expires = formatExpiry(album.expiresAt);

  return (
    <section className="space-y-8">
      <header>
        <p className="font-display tracking-[0.25em] text-xs opacity-60">
          PRIVATE SESSION
        </p>
        <h2 className="font-display tracking-[0.2em] text-2xl md:text-3xl mt-2">
          {album.name.toUpperCase()}
        </h2>
        {album.description && (
          <p className="mt-4 max-w-2xl text-sm opacity-70">
            {album.description}
          </p>
        )}
        <p className="mt-3 text-xs opacity-70">
          {expires
            ? `Available until ${expires}`
            : "No expiry set"}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="py-16 text-center font-display tracking-[0.2em] text-sm opacity-60">
          NO IMAGES UPLOADED YET.
        </p>
      ) : (
        <MasonryGallery items={items} />
      )}
    </section>
  );
}
