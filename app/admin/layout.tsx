import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="container-editorial py-12">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 md:pb-8 border-b border-[color:var(--color-ink)]/10">
        <div>
          <p className="font-display tracking-[0.25em] text-xs opacity-60">
            ADMIN
          </p>
          <h1 className="font-display tracking-[0.2em] text-2xl mt-1">
            BOOK &amp; CAPTURE
          </h1>
        </div>

        <nav
          aria-label="Admin"
          className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto"
        >
          <ul className="flex items-center gap-5 md:gap-6 font-display text-xs tracking-[0.2em] whitespace-nowrap">
            <li>
              <Link href="/admin" className="py-2 inline-block hover:opacity-60">
                DASHBOARD
              </Link>
            </li>
            <li>
              <Link
                href="/admin/albums"
                className="py-2 inline-block hover:opacity-60"
              >
                ALBUMS
              </Link>
            </li>
            <li>
              <Link
                href="/admin/clients"
                className="py-2 inline-block hover:opacity-60"
              >
                CLIENTS
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="py-2 inline-block hover:opacity-60"
              >
                SETTINGS
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="py-2 inline-block hover:opacity-60"
                target="_blank"
              >
                VIEW SITE
              </Link>
            </li>
            <li>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="py-2 font-display tracking-[0.2em] text-xs hover:opacity-60"
                >
                  SIGN OUT
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </header>

      <div className="py-10">{children}</div>

      <footer className="pt-8 border-t border-[color:var(--color-ink)]/10 text-xs opacity-60">
        Signed in as {profile?.email ?? user.email}
      </footer>
    </div>
  );
}
