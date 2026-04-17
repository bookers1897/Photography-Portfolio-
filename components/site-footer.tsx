import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon, VimeoIcon } from "@/components/social-icons";
import { brand } from "@/lib/portfolio";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--color-border)] mt-24">
      <div className="container-editorial py-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr] text-sm">
        <div>
          <p className="font-display text-3xl leading-none tracking-wide">
            BOOK &amp;
          </p>
          <p className="font-display text-4xl leading-none tracking-wide -mt-1">
            CAPTURE
          </p>
          <p className="mt-4 text-[color:var(--color-ink-muted)] max-w-xs">
            Photography &amp; videography for people and brands. Worldwide booking.
          </p>
        </div>

        <div>
          <p className="text-display text-xs tracking-[0.2em] text-[color:var(--color-ink-muted)] mb-3">
            EXPLORE
          </p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/work" className="hover:opacity-60">
                Work
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:opacity-60">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:opacity-60">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-display text-xs tracking-[0.2em] text-[color:var(--color-ink-muted)] mb-3">
            CONNECT
          </p>
          <div className="flex items-center gap-3 mb-4">
            <a
              href={brand.instagramUrl}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 -ml-2 hover:opacity-60 transition-opacity"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={brand.vimeoUrl}
              aria-label="Vimeo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <VimeoIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${brand.email}`}
              aria-label="Email"
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>
          <a
            href={`mailto:${brand.email}`}
            className="text-sm text-[color:var(--color-ink-muted)] underline underline-offset-4 hover:text-[color:var(--color-ink)]"
          >
            {brand.email}
          </a>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-border)]">
        <div className="container-editorial py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[color:var(--color-ink-muted)]">
          <span>© {year} Book &amp; Capture. All rights reserved.</span>
          <span className="font-display tracking-[0.2em]">
            PHOTOGRAPHY · VIDEOGRAPHY
          </span>
        </div>
      </div>
    </footer>
  );
}
