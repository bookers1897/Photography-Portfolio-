"use client";

import { useActionState, useState } from "react";
import { inviteClientAction, type InviteState } from "./actions";

export function InviteForm() {
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    inviteClientAction,
    {},
  );
  const [copied, setCopied] = useState(false);

  async function copyPassword() {
    if (!state.tempPassword) return;
    try {
      await navigator.clipboard.writeText(state.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="space-y-4">
      <form
        action={formAction}
        className="flex flex-col sm:flex-row gap-3 max-w-2xl"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="client@example.com"
          autoComplete="off"
          className="flex-1 border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-base md:text-sm focus:outline-none focus:border-[color:var(--color-ink)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 px-6 font-display tracking-[0.25em] text-xs disabled:opacity-60"
        >
          {pending ? "INVITING…" : "INVITE"}
        </button>
      </form>

      {state.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      {state.ok && state.email && state.tempPassword && (
        <div className="border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] p-4 max-w-2xl">
          <p className="font-display tracking-[0.2em] text-xs opacity-70">
            TEMPORARY CREDENTIALS
          </p>
          <p className="mt-2 text-sm">
            Deliver these to{" "}
            <span className="font-mono">{state.email}</span> out-of-band (SMS,
            text, or secure chat). They won&apos;t be shown again.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <code className="flex-1 border border-[color:var(--color-ink)]/20 px-3 py-2 text-sm font-mono bg-white">
              {state.tempPassword}
            </code>
            <button
              type="button"
              onClick={copyPassword}
              className="py-2 px-4 font-display tracking-[0.2em] text-xs border border-[color:var(--color-ink)]/30 hover:opacity-60"
            >
              {copied ? "COPIED" : "COPY"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
