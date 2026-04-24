"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "./actions";

type Props = {
  next?: string;
  initialError?: string;
};

export function LoginForm({ next, initialError }: Props) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signInAction,
    { error: initialError },
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />

      <label className="block">
        <span className="block text-xs font-display tracking-[0.2em] mb-2 opacity-80">
          EMAIL
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-base md:text-sm focus:outline-none focus:border-[color:var(--color-ink)]"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-display tracking-[0.2em] mb-2 opacity-80">
          PASSWORD
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-[color:var(--color-ink)]/20 bg-[color:var(--color-surface)] px-3 py-2 text-base md:text-sm focus:outline-none focus:border-[color:var(--color-ink)]"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[color:var(--color-ink)] text-[color:var(--color-surface)] py-2 font-display tracking-[0.25em] text-xs disabled:opacity-60"
      >
        {pending ? "SIGNING IN…" : "SIGN IN"}
      </button>
    </form>
  );
}
