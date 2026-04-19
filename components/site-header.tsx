"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { InstagramIcon, VimeoIcon } from "@/components/social-icons";
import { AnimatePresence, motion } from "motion/react";
import { brand, type Album } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/login/actions";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({
  albums = [],
  isAuthenticated = false,
  userRole = null,
}: {
  albums?: Album[];
  isAuthenticated?: boolean;
  userRole?: "admin" | "client" | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 h-[var(--header-h)] px-6 md:px-8",
          "flex items-center justify-between",
          "bg-[color:var(--color-bg)]/90 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.06)]",
        )}
      >
        <Link
          href="/"
          className="group flex flex-col leading-none tracking-wide"
          aria-label={`${brand.name} home`}
        >
          <span className="font-display text-[22px] md:text-[24px] transition-opacity group-hover:opacity-60">
            BOOK &amp;
          </span>
          <span className="font-display text-[34px] md:text-[38px] -mt-1 transition-opacity group-hover:opacity-60">
            CAPTURE
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8 font-display text-sm tracking-[0.18em]"
          aria-label="Primary"
        >
          {NAV_LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative py-2 transition-opacity",
                  active
                    ? "opacity-100 after:w-full"
                    : "opacity-70 hover:opacity-100",
                  "after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:bg-[color:var(--color-ink)] after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)]",
                  !active && "after:w-0 hover:after:w-full",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex md:hidden p-2 -mr-2 transition-transform hover:scale-110 focus-visible:scale-110"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="hidden md:flex p-2 -mr-2 transition-transform hover:scale-110 focus-visible:scale-110"
        >
          <Menu className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden
            />
            <motion.nav
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed top-0 right-0 z-50 h-[100dvh] w-full max-w-[420px] bg-[color:var(--color-bg)] shadow-xl overflow-y-auto flex flex-col px-10 pt-20 pb-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                className="absolute top-6 right-6 p-2 transition-transform hover:rotate-90"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>

              <ul className="flex flex-col gap-1 mb-10 font-display text-[28px] tracking-[0.05em]">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.05,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "block py-2 transition-transform hover:translate-x-2",
                        pathname === l.href && "opacity-100",
                        pathname !== l.href && "opacity-80 hover:opacity-100",
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <p className="text-display text-xs tracking-[0.2em] text-[color:var(--color-ink-muted)] mb-3">
                ALBUMS
              </p>
              <ul className="flex flex-col gap-1 mb-auto text-[20px] font-display tracking-wider">
                {albums.map((a, i) => (
                  <motion.li
                    key={a.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.04,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Link
                      href={`/work/${a.slug}`}
                      className="block py-1 opacity-70 hover:opacity-100 hover:translate-x-2 transition-all"
                    >
                      {a.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-[color:var(--color-border)] font-display tracking-[0.2em] text-sm flex flex-col gap-1">
                {isAuthenticated && userRole === "client" && (
                  <Link
                    href="/portal"
                    className="block py-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    MY SESSIONS
                  </Link>
                )}
                {isAuthenticated && userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="block py-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    ADMIN
                  </Link>
                )}
                {isAuthenticated ? (
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="block py-1 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      LOGOUT
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    className="block py-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    LOGIN
                  </Link>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[color:var(--color-border)] flex flex-col gap-4">
                <div className="flex items-center gap-4">
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
                <p className="text-sm text-[color:var(--color-ink-muted)]">
                  <span className="block mb-1">Booking &amp; inquiries</span>
                  <a
                    href={`mailto:${brand.email}`}
                    className="underline underline-offset-4 hover:text-[color:var(--color-ink)]"
                  >
                    {brand.email}
                  </a>
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
