import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { storagePublicUrl } from "@/lib/utils";
import {
  deleteAlbumAction,
  deleteMediaAction,
  setAlbumCoverAction,
  updateAlbumAction,
} from "../../actions";
import { MediaDropzone } from "@/components/admin/dropzone";

type Params = Promise<{ slug: string }>;

export default async function AlbumEditorPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: album } = await supabase
    .from("albums")
    .select("id, slug, name, description, published, cover_media_id")
    .eq("slug", slug)
    .single();

  if (!album) notFound();

  const { data: media } = await supabase
    .from("media")
    .select(
      "id, type, storage_path, poster_path, name, alt, width, height, position, published",
    )
    .eq("album_id", album.id)
    .order("position");

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/albums"
          className="font-display text-xs tracking-[0.2em] opacity-60 hover:opacity-100"
        >
          ← ALBUMS
        </Link>
        <h2 className="font-display tracking-[0.2em] text-xl mt-2">
          {album.name.toUpperCase()}
        </h2>
      </div>

      <section className="grid lg:grid-cols-2 gap-8">
        <form action={updateAlbumAction} className="space-y-4">
          <input type="hidden" name="id" value={album.id} />
          <input type="hidden" name="slug" value={album.slug} />

          <h3 className="font-display tracking-[0.2em] text-sm">DETAILS</h3>

          <label className="block">
            <span className="block text-xs font-display tracking-[0.2em] mb-2 opacity-80">
              NAME
            </span>
            <input
              type="text"
              name="name"
              defaultValue={album.name}
              required
              className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-display tracking-[0.2em] mb-2 opacity-80">
              DESCRIPTION
            </span>
            <textarea
              name="description"
              defaultValue={album.description ?? ""}
              rows={3}
              className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-sm resize-none"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={album.published}
            />
            <span>Published</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 px-6 font-display tracking-[0.25em] text-xs"
            >
              SAVE
            </button>
          </div>
        </form>

        <form action={deleteAlbumAction} className="self-end">
          <input type="hidden" name="id" value={album.id} />
          <button
            type="submit"
            className="border border-red-700/40 text-red-700 py-2 px-6 font-display tracking-[0.25em] text-xs hover:bg-red-700 hover:text-white transition"
          >
            DELETE ALBUM
          </button>
        </form>
      </section>

      <section>
        <h3 className="font-display tracking-[0.2em] text-sm mb-4">UPLOAD</h3>
        <MediaDropzone albumId={album.id} albumSlug={album.slug} />
      </section>

      <section>
        <h3 className="font-display tracking-[0.2em] text-sm mb-4">
          MEDIA ({media?.length ?? 0})
        </h3>
        {(!media || media.length === 0) && (
          <p className="text-sm opacity-60">
            No media yet. Drop files above to upload.
          </p>
        )}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(media ?? []).map((m) => {
            const url = storagePublicUrl(m.storage_path);
            const poster = m.poster_path
              ? storagePublicUrl(m.poster_path)
              : null;
            const isCover = album.cover_media_id === m.id;
            return (
              <li
                key={m.id}
                className="group relative border border-[color:var(--color-ink)]/10 bg-[color:var(--color-surface)]"
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${m.width} / ${m.height}` }}
                >
                  {m.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={m.alt ?? m.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poster ?? url}
                      alt={m.alt ?? m.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {m.type === "video" && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 font-display tracking-[0.2em]">
                      VIDEO
                    </span>
                  )}
                  {isCover && (
                    <span className="absolute top-2 left-2 bg-[color:var(--color-ink)] text-[color:var(--color-surface)] text-[10px] px-2 py-0.5 font-display tracking-[0.2em]">
                      COVER
                    </span>
                  )}
                </div>
                <div className="p-2 text-xs flex flex-col gap-2">
                  <span className="truncate">{m.name}</span>
                  <div className="flex gap-2 flex-wrap">
                    <form action={setAlbumCoverAction}>
                      <input
                        type="hidden"
                        name="album_id"
                        value={album.id}
                      />
                      <input type="hidden" name="media_id" value={m.id} />
                      <input type="hidden" name="slug" value={album.slug} />
                      <button
                        type="submit"
                        disabled={isCover}
                        className="text-[10px] font-display tracking-[0.2em] opacity-70 hover:opacity-100 disabled:opacity-30"
                      >
                        {isCover ? "IS COVER" : "SET COVER"}
                      </button>
                    </form>
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="slug" value={album.slug} />
                      <button
                        type="submit"
                        className="text-[10px] font-display tracking-[0.2em] text-red-700 opacity-80 hover:opacity-100"
                      >
                        DELETE
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
