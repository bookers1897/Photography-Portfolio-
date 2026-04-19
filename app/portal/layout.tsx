import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  return (
    <div className="container-editorial py-12 pt-[calc(var(--header-h)+3rem)]">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[color:var(--color-ink)]/10">
        <div>
          <p className="font-display tracking-[0.25em] text-xs opacity-60">
            CLIENT PORTAL
          </p>
          <h1 className="font-display tracking-[0.2em] text-2xl mt-1">
            BOOK &amp; CAPTURE
          </h1>
        </div>

        <nav
          aria-label="Portal"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-xs tracking-[0.2em]"
        >
          <Link href="/portal" className="hover:opacity-60">
            MY SESSIONS
          </Link>
          <Link href="/" className="hover:opacity-60">
            VIEW SITE
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="font-display tracking-[0.2em] text-xs hover:opacity-60"
            >
              SIGN OUT
            </button>
          </form>
        </nav>
      </header>

      <div className="py-10">{children}</div>

      <footer className="pt-8 border-t border-[color:var(--color-ink)]/10 text-xs opacity-60">
        Signed in as {profile?.email ?? user.email}
      </footer>
    </div>
  );
}
