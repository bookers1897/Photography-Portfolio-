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
  expires_at?: string | null;
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
    expiresAt: row.expires_at ?? undefined,
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
      .eq("visibility", "public")
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
      .eq("visibility", "public")
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToAlbum(data as unknown as AlbumRow);
  } catch {
    return undefined;
  }
}

export async function getClientAlbums(userId: string): Promise<Album[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("albums")
      .select(
        "id, slug, name, description, position, cover_media_id, expires_at, cover:media!albums_cover_media_id_fkey(storage_path)",
      )
      .eq("visibility", "private")
      .eq("owner_id", userId)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as unknown as AlbumRow[]).map(rowToAlbum);
  } catch {
    return [];
  }
}

export async function getClientAlbumBySlug(
  slug: string,
  userId: string,
): Promise<Album | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const supabase = await createSupabaseServerClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("albums")
      .select(
        "id, slug, name, description, position, cover_media_id, expires_at, cover:media!albums_cover_media_id_fkey(storage_path)",
      )
      .eq("slug", slug)
      .eq("visibility", "private")
      .eq("owner_id", userId)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .maybeSingle();
    if (error || !data) return undefined;
    return rowToAlbum(data as unknown as AlbumRow);
  } catch {
    return undefined;
  }
}

export async function getMediaForClientAlbum(
  albumId: string,
): Promise<MediaItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, album_id, type, storage_path, poster_path, name, alt, width, height, position",
      )
      .eq("album_id", albumId)
      .order("position");
    if (error) return [];
    return (data as unknown as MediaRow[]).map(rowToMedia);
  } catch {
    return [];
  }
}

export async function getAllMedia(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, album_id, type, storage_path, poster_path, name, alt, width, height, position, album:albums!media_album_id_fkey!inner(slug, published, visibility)",
      )
      .eq("published", true)
      .eq("album.published", true)
      .eq("album.visibility", "public")
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

export type SiteSettings = {
  heroMediaId: string | null;
  focalX: number;
  focalY: number;
  overlay: number;
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroMediaId: null,
  focalX: 50,
  focalY: 50,
  overlay: 0.35,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SITE_SETTINGS;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_media_id, hero_focal_x, hero_focal_y, hero_overlay")
      .eq("id", true)
      .maybeSingle();
    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return {
      heroMediaId: (data.hero_media_id as string | null) ?? null,
      focalX: Number(data.hero_focal_x ?? 50),
      focalY: Number(data.hero_focal_y ?? 50),
      overlay: Number(data.hero_overlay ?? 0.35),
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export type HeroImage = MediaItem & {
  focalX: number;
  focalY: number;
  overlay: number;
};

async function getMediaById(id: string): Promise<MediaItem | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("media")
      .select(
        "id, album_id, type, storage_path, poster_path, name, alt, width, height, position",
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToMedia(data as unknown as MediaRow);
  } catch {
    return null;
  }
}

export async function getHeroImage(): Promise<HeroImage | null> {
  const settings = await getSiteSettings();

  let item: MediaItem | null = null;
  if (settings.heroMediaId) {
    item = await getMediaById(settings.heroMediaId);
  }
  if (!item) {
    const all = await getAllMedia();
    item = all.find((m) => m.type === "image") ?? all[0] ?? null;
  }
  if (!item) return null;

  return {
    ...item,
    focalX: settings.focalX,
    focalY: settings.focalY,
    overlay: settings.overlay,
  };
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
