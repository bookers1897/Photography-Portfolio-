import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InviteForm } from "./invite-form";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, email, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display tracking-[0.2em] text-sm mb-4">
          INVITE CLIENT
        </h2>
        <p className="text-sm opacity-70 mb-4 max-w-2xl">
          Creates a login with a one-time temporary password. Copy the password
          from the confirmation card and deliver it to the client directly —
          they can sign in at <span className="font-mono">/login</span> and
          will land on <span className="font-mono">/portal</span>.
        </p>
        <InviteForm />
      </section>

      <section>
        <h2 className="font-display tracking-[0.2em] text-sm mb-4">
          ALL CLIENTS
        </h2>
        {(!clients || clients.length === 0) && (
          <p className="text-sm opacity-60">No clients yet.</p>
        )}
        <ul className="divide-y divide-[color:var(--color-ink)]/10 border-y border-[color:var(--color-ink)]/10">
          {(clients ?? []).map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <span className="font-display tracking-[0.2em] text-sm">
                  {c.email}
                </span>
                <p className="text-xs opacity-60 mt-1 font-mono">{c.id}</p>
              </div>
              <span className="text-xs opacity-60">
                {c.created_at
                  ? new Date(c.created_at).toLocaleDateString()
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
