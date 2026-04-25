import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAlbumAction } from "../actions";
import { SortableAlbumList } from "@/components/admin/sortable-album-list";

export const dynamic = "force-dynamic";

export default async function AlbumsListPage() {
  const supabase = await createSupabaseServerClient();
  const { data: albums } = await supabase
    .from("albums")
    .select(
      "id, slug, name, description, published, position, cover_media_id, visibility",
    )
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
            className="flex-1 border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-base md:text-sm focus:outline-none focus:border-[color:var(--color-ink)]"
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
        <h2 className="font-display tracking-[0.2em] text-sm mb-2">
          ALL ALBUMS
        </h2>
        <p className="text-xs opacity-60 mb-4">
          Drag the handle on the left to reorder. The order here is the order
          on <span className="font-mono">/</span> and{" "}
          <span className="font-mono">/work</span>.
        </p>
        <SortableAlbumList albums={albums ?? []} />
      </section>
    </div>
  );
}
