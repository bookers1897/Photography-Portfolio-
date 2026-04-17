import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAlbumAction } from "../actions";

export default async function AlbumsListPage() {
  const supabase = await createSupabaseServerClient();
  const { data: albums } = await supabase
    .from("albums")
    .select("id, slug, name, description, published, position, cover_media_id")
    .order("position");

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display tracking-[0.2em] text-sm mb-4">
          CREATE ALBUM
        </h2>
        <form
          action={createAlbumAction}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Album name"
            className="flex-1 border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-ink)]"
          />
          <button
            type="submit"
            className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 px-6 font-display tracking-[0.25em] text-xs"
          >
            CREATE
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display tracking-[0.2em] text-sm mb-4">
          ALL ALBUMS
        </h2>
        {(!albums || albums.length === 0) && (
          <p className="text-sm opacity-60">No albums yet.</p>
        )}
        <ul className="divide-y divide-[color:var(--color-ink)]/10 border-y border-[color:var(--color-ink)]/10">
          {(albums ?? []).map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/albums/${a.slug}`}
                className="flex items-center justify-between py-4 hover:opacity-60"
              >
                <div>
                  <span className="font-display tracking-[0.2em] text-sm">
                    {a.name.toUpperCase()}
                  </span>
                  {a.description && (
                    <p className="text-xs opacity-60 mt-1">{a.description}</p>
                  )}
                </div>
                <span className="text-xs opacity-60">
                  {a.published ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
