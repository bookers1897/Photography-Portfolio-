import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  const [{ data: albums }, { count: mediaCount }] = await Promise.all([
    supabase
      .from("albums")
      .select("id, slug, name, published, position")
      .order("position"),
    supabase.from("media").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-10">
      <section className="grid gap-6 sm:grid-cols-3">
        <Stat label="ALBUMS" value={albums?.length ?? 0} />
        <Stat label="MEDIA ITEMS" value={mediaCount ?? 0} />
        <Stat
          label="PUBLISHED"
          value={albums?.filter((a) => a.published).length ?? 0}
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display tracking-[0.2em] text-sm">ALBUMS</h2>
          <Link
            href="/admin/albums"
            className="font-display text-xs tracking-[0.2em] hover:opacity-60"
          >
            MANAGE →
          </Link>
        </div>
        <ul className="divide-y divide-[color:var(--color-ink)]/10 border-y border-[color:var(--color-ink)]/10">
          {(albums ?? []).map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/albums/${a.slug}`}
                className="flex items-center justify-between gap-3 py-5 px-2 -mx-2 hover:opacity-60 touch-manipulation"
              >
                <span className="font-display tracking-[0.2em] text-sm truncate">
                  {a.name.toUpperCase()}
                </span>
                <span className="text-xs opacity-60 shrink-0">
                  {a.published ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
          {(!albums || albums.length === 0) && (
            <li className="py-8 text-center text-sm opacity-60">
              No albums yet. Create one in Albums.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[color:var(--color-ink)]/10 p-6">
      <p className="font-display tracking-[0.25em] text-xs opacity-60">
        {label}
      </p>
      <p className="font-display text-4xl mt-2">{value}</p>
    </div>
  );
}
