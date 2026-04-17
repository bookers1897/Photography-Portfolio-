import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { InstagramIcon, VimeoIcon } from "@/components/social-icons";
import { brand } from "@/lib/portfolio";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book Book & Capture for editorial, beauty, lifestyle, commercial, and motion work. Inquire about your next project.",
};

export default function ContactPage() {
  return (
    <>
      <section className="container-editorial pt-[calc(var(--header-h)+2rem)] pb-12 md:pb-16">
        <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-4">
          LET&apos;S TALK
        </p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-wide max-w-[12ch]">
          BOOK A PROJECT.
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-lg text-[color:var(--color-ink-muted)]">
          Tell us about the concept, the people, and the timeline. We&apos;ll
          reply within two business days with availability and the right
          approach.
        </p>
      </section>

      <section className="container-editorial pb-24 md:pb-32 grid gap-12 md:gap-16 lg:grid-cols-[1fr_1.6fr]">
        <aside className="flex flex-col gap-10 text-sm">
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-3">
              EMAIL
            </p>
            <Link
              href={`mailto:${brand.email}`}
              className="font-serif text-xl md:text-2xl underline underline-offset-4 hover:opacity-70 transition"
            >
              {brand.email}
            </Link>
          </div>
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-3">
              BASED IN
            </p>
            <p className="font-serif text-lg inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              United States · Worldwide booking
            </p>
          </div>
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-3">
              FOLLOW
            </p>
            <div className="flex items-center gap-3">
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 -ml-2 hover:opacity-60 transition"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={brand.vimeoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vimeo"
                className="p-2 hover:opacity-60 transition"
              >
                <VimeoIcon className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${brand.email}`}
                aria-label="Email"
                className="p-2 hover:opacity-60 transition"
              >
                <Mail className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div>
            <p className="font-display tracking-[0.3em] text-xs opacity-70 mb-3">
              FOR PRESS
            </p>
            <p className="font-serif text-[color:var(--color-ink-muted)] leading-relaxed">
              Tearsheets, bio, and press-ready images are available on request.
            </p>
          </div>
        </aside>

        <div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
