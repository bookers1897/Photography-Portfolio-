import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getClientAlbums } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

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

export default async function PortalPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const albums = await getClientAlbums(user.id);

  return (
    <section className="space-y-8">
      <header>
        <h2 className="font-display tracking-[0.2em] text-sm">MY SESSIONS</h2>
        <p className="text-sm opacity-70 mt-2 max-w-xl">
          Your private galleries live here. Each session remains available for
          download until its expiry date, after which it is removed from the
          site.
        </p>
      </header>

      {albums.length === 0 ? (
        <div className="border border-dashed border-[color:var(--color-ink)]/20 py-20 px-6 text-center">
          <p className="font-display tracking-[0.2em] text-sm opacity-70">
            NO SESSIONS YET
          </p>
          <p className="mt-3 text-sm opacity-60 max-w-md mx-auto">
            When your photographer publishes a session for you, it will appear
            here with a download window.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const expires = formatExpiry(album.expiresAt);
            return (
              <li key={album.id}>
                <Link
                  href={`/portal/${album.slug}`}
                  className="group block"
                  aria-label={`Open ${album.name}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-surface)] border border-[color:var(--color-ink)]/10">
                    {album.cover ? (
                      <Image
                        src={album.cover}
                        alt={album.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs opacity-40 font-display tracking-[0.2em]">
                        NO COVER
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <h3 className="font-display tracking-[0.2em] text-sm">
                      {album.name.toUpperCase()}
                    </h3>
                    {album.description && (
                      <p className="mt-2 text-xs opacity-60 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs opacity-70">
                      {expires
                        ? `Available until ${expires}`
                        : "No expiry set"}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
