"use client";

import { useActionState, useEffect, useRef } from "react";
import { CircleCheckBig, Send } from "lucide-react";
import { submitContact, type ContactResult } from "@/app/contact/actions";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  "Editorial",
  "Beauty / Campaign",
  "Lifestyle",
  "Portraits",
  "Brand / Commercial",
  "Motion / Video",
  "Other",
];

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    submitContact,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const errors = state && !state.ok ? state.errors : {};

  if (state?.ok) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-5 p-10 bg-[color:var(--color-surface)] border border-[color:var(--color-border)]"
      >
        <CircleCheckBig className="h-10 w-10" strokeWidth={1.5} />
        <div>
          <h3 className="font-display text-3xl tracking-wide mb-2">
            MESSAGE RECEIVED.
          </h3>
          <p className="font-serif text-[color:var(--color-ink-muted)]">
            Thanks for reaching out — we&apos;ll reply within two business days.
            If it&apos;s urgent, email hello@bookandcapture.com directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="grid gap-6 md:grid-cols-2"
      noValidate
    >
      <Field
        label="Name"
        name="name"
        required
        error={errors?.name}
        className="md:col-span-1"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        error={errors?.email}
        className="md:col-span-1"
      />
      <div className="md:col-span-1 flex flex-col gap-2">
        <Label htmlFor="projectType">Project type</Label>
        <select
          id="projectType"
          name="projectType"
          required
          defaultValue={PROJECT_TYPES[0]}
          className={inputClass}
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <FieldError message={errors?.projectType} />
      </div>
      <Field
        label="Budget (optional)"
        name="budget"
        placeholder="e.g. $5k–$10k"
        className="md:col-span-1"
      />
      <Field
        label="Timeline (optional)"
        name="timeline"
        placeholder="e.g. Shooting in June"
        className="md:col-span-2"
      />
      <div className="md:col-span-2 flex flex-col gap-2">
        <Label htmlFor="message">Tell us about the project</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={inputClass}
          placeholder="Concept, references, locations, talent, deliverables…"
        />
        <FieldError message={errors?.message} />
      </div>

      <input
        type="text"
        name="company"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden
        className="hidden"
      />

      <div className="md:col-span-2 flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3.5 font-display tracking-[0.2em] text-sm",
            "bg-[color:var(--color-ink)] text-[color:var(--color-bg)]",
            "hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {pending ? "SENDING…" : "SEND INQUIRY"}
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <p className="text-xs text-[color:var(--color-ink-muted)] font-serif italic">
          We reply within two business days.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-transparent border border-[color:var(--color-border)] px-4 py-3 font-serif text-base focus:border-[color:var(--color-ink)] focus:outline-none transition-colors";

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-display tracking-[0.2em] text-xs opacity-70"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  error,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-[color:var(--color-danger)] font-serif">
      {message}
    </p>
  );
}
