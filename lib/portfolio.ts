import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { storagePublicUrl } from "@/lib/utils";
import type { Album, MediaItem } from "@/lib/brand";

export { brand } from "@/lib/brand";
export type { Album, MediaItem } from "@/lib/brand";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

type AlbumRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  cover_media_id: string | null;
  cover?: { storage_path: string | null } | null;
};

type MediaRow = {
  id: string;
  album_id: string;
  type: "image" | "video";
  storage_path: string;
  poster_path: string | null;
  name: string;
  alt: string | null;
  width: number;
  height: number;
  position: number;
  album?: { slug: string } | null;
};

function rowToAlbum(row: AlbumRow): Album {
  const coverPath = row.cover?.storage_path ?? null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    cover: coverPath ? storagePublicUrl(coverPath) : undefined,
  };
}

function rowToMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    albumId: row.album_id,
    albumSlug: row.album?.slug,
    type: row.type,
    src: storagePublicUrl(row.storage_path),
    poster: row.poster_path ? storagePublicUrl(row.poster_path) : undefined,
    name: row.name,
    alt: row.alt ?? undefined,
    width: row.width,
    height: row.height,
  };
}

export async function getAllAlbums(): Promise<Album[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("albums")
      .select(
        "id, slug, name, description, position, cover_media_id, cover:media!albums_cover_media_id_fkey(storage_path)",
      )
      .eq("published", true)
      .order("position");
    if (error) return [];
    return (data as unknown as AlbumRow[]).map(rowToAlbum);
  } catch {
    return [];
  }
}

export async function getAlbumBySlug(slug: string): Promise<Album | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("albums")
      .select(
        "id, slug, name, description, position, cover_media_id, cover:media!albums_cover_media_id_fkey(storage_path)",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToAlbum(data as unknown as AlbumRow);
  } catch {
    return undefined;
  }
}

export async function getAllMedia(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, album_id, type, storage_path, poster_path, name, alt, width, height, position, album:albums!media_album_id_fkey!inner(slug, published)",
      )
      .eq("published", true)
      .eq("album.published", true)
      .order("position");
    if (error) return [];
    return (data as unknown as MediaRow[]).map(rowToMedia);
  } catch {
    return [];
  }
}

export async function getMediaForAlbum(
  slug: string | null,
): Promise<MediaItem[]> {
  if (!slug || slug === "all") return getAllMedia();
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data: album } = await supabase
      .from("albums")
      .select("id")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (!album) return [];
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, album_id, type, storage_path, poster_path, name, alt, width, height, position",
      )
      .eq("album_id", album.id)
      .eq("published", true)
      .order("position");
    if (error) return [];
    return (data as unknown as MediaRow[]).map(rowToMedia);
  } catch {
    return [];
  }
}

export async function getHeroImage(): Promise<MediaItem | null> {
  const all = await getAllMedia();
  const firstImage = all.find((m) => m.type === "image");
  return firstImage ?? all[0] ?? null;
}

export async function getFeaturedMedia(limit = 6): Promise<MediaItem[]> {
  const all = await getAllMedia();
  return all.slice(0, limit);
}

export async function getAlbumSlides(): Promise<
  Array<{ album: Album; cover: MediaItem }>
> {
  const [albums, media] = await Promise.all([getAllAlbums(), getAllMedia()]);
  const firstByAlbum = new Map<string, MediaItem>();
  for (const m of media) {
    if (m.type !== "image") continue;
    if (!firstByAlbum.has(m.albumId)) firstByAlbum.set(m.albumId, m);
  }
  const slides: Array<{ album: Album; cover: MediaItem }> = [];
  for (const a of albums) {
    const cover = firstByAlbum.get(a.id);
    if (cover) slides.push({ album: a, cover });
  }
  return slides;
}

export async function getMosaicMedia(limit = 12): Promise<MediaItem[]> {
  const all = await getAllMedia();
  const byAlbum = new Map<string, MediaItem[]>();
  for (const m of all) {
    if (m.type !== "image") continue;
    const key = m.albumSlug ?? m.albumId;
    const arr = byAlbum.get(key) ?? [];
    arr.push(m);
    byAlbum.set(key, arr);
  }
  const queues = Array.from(byAlbum.values());
  const out: MediaItem[] = [];
  let round = 0;
  while (out.length < limit) {
    let pulled = false;
    for (const q of queues) {
      if (round < q.length) {
        out.push(q[round]);
        pulled = true;
        if (out.length >= limit) break;
      }
    }
    if (!pulled) break;
    round++;
  }
  return out;
}
