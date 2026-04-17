import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-editorial pt-[calc(var(--header-h)+4rem)] pb-32 text-center">
      <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
        404
      </p>
      <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-wide">
        NOT FOUND.
      </h1>
      <p className="mt-6 max-w-xl mx-auto font-serif text-lg text-[color:var(--color-ink-muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4 font-display tracking-[0.2em] text-sm">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-[color:var(--color-ink)] text-[color:var(--color-bg)] hover:opacity-90 transition"
        >
          BACK TO HOME
        </Link>
        <Link
          href="/work"
          className="inline-flex items-center px-6 py-3 border border-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-[color:var(--color-bg)] transition"
        >
          VIEW WORK
        </Link>
      </div>
    </section>
  );
}
