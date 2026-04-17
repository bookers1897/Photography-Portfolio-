# Book & Capture — Portfolio Site Design

**Date:** 2026-04-16
**Status:** Approved by user (autonomous-execution directive)
**Scope:** Replace the vanilla 3-file prototype with a Next.js portfolio site, keep it expandable.

## Context

The starting point was a vanilla HTML/CSS/JS prototype (~1600 LOC) committed to GitHub at `bookers1897/Photography-Portfolio-`. It was scaffolded as a single-page admin-style gallery with album management UI visible to any visitor. The user confirmed:

- The site should be **public-browse only**; admin actions (upload, create/rename/delete album) should be hidden behind a login.
- Clients should later get a per-client portal to view and download their shoot — **deferred to a later iteration**.
- Branding: **Book & Capture** (rename from "Brittany Bravo").
- User wants the site expandable (blog, bookings, portal) — chose **Next.js** over staying vanilla.

## Goals (this iteration)

1. Replace the vanilla prototype with a Next.js 15 App Router app.
2. Ship the public side: Home (fullscreen hero), Work (gallery + album filter + lightbox), About, Contact (with form and social links).
3. Keep the editorial warm-cream + Bebas Neue + EB Garamond aesthetic as a starting point; it's a good foundation and we can refine after the user sees it live.
4. Use `next/image` for photography-grade image optimization.
5. Solid SEO: metadata, Open Graph, JSON-LD Photographer/LocalBusiness.
6. Smooth animations (Framer Motion) that respect `prefers-reduced-motion`.
7. Accessibility: keyboard nav, focus traps on lightbox/modals, proper landmarks.

## Non-goals (this iteration)

- Client portal + auth (next iteration)
- Admin upload UI (next iteration — clients and admin coming together)
- CMS integration (keep content in a typed config file for now)
- Real-image storage backend (use a curated set of Unsplash placeholders for now, easy to swap for Cloudinary/Vercel Blob later)
- E-commerce / booking (future)

## Architecture

```
book-and-capture/
├── app/
│   ├── layout.tsx              # Root layout, fonts, theme
│   ├── page.tsx                # / — Home (hero)
│   ├── work/
│   │   ├── page.tsx            # /work — gallery
│   │   └── [album]/page.tsx    # /work/editorial etc.
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── actions.ts              # server actions (contact form)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── site-header.tsx         # fixed header + hamburger
│   ├── side-nav.tsx            # slide-out nav (client component)
│   ├── site-footer.tsx
│   ├── masonry-gallery.tsx     # client component, Framer Motion
│   ├── lightbox.tsx            # client component, keyboard nav
│   ├── hero.tsx                # home hero
│   ├── contact-form.tsx        # client form w/ server action
│   └── ui/                     # shadcn primitives (button, input, etc.)
├── lib/
│   ├── portfolio.ts            # typed portfolio data (albums, media)
│   └── utils.ts                # cn() from shadcn
├── public/
│   └── og-image.jpg
├── styles/
│   └── globals.css             # Tailwind + design tokens
└── next.config.ts              # next/image remote patterns
```

## Design tokens (starting values)

```
bg:        #f5f0eb   (warm cream)
bg-card:   #ffffff
text:      #1a1a1a
text-muted #6b6b6b
border:    #e0dbd5
accent:    #1a1a1a
font-display: Bebas Neue
font-body:    EB Garamond (serif)
radius:    4px
```

These are portable between Tailwind + shadcn via CSS variables. User can retune after first look.

## Components of note

### masonry-gallery
CSS `columns` for the masonry, `next/image` with natural aspect ratio (drop the fixed `h-short/medium/tall` approach that forced awkward crops). Stagger in with Framer Motion on mount. Per-album filtering via route (`/work/[album]`) — no JS state hydration cost for switching.

### lightbox
Portal to body, focus trap, keyboard nav (arrow keys + Esc), swipe on touch devices, preload neighbor images, respect `prefers-reduced-motion`.

### contact-form
Server Action (`app/actions.ts`). Zod validation. For now, logs to server console and returns success; wiring to email (Resend or plain SMTP) is a tiny add later. Form errors inline.

### side-nav
React Portal + focus trap. Escape closes. Body-scroll lock via `useEffect` cleanup (fixes the stacking bug in the vanilla version).

## Data

For this iteration, `lib/portfolio.ts` exports a typed `Portfolio` object with albums + media items. Source URLs are Unsplash (same seed images as before). Later, swap for Cloudinary or Vercel Blob + a real CMS.

```ts
export type Album = { id: string; name: string; cover?: string };
export type Media = { id: string; albumId: string; type: 'image' | 'video'; src: string; name: string; w: number; h: number };
```

Including `w`/`h` enables `next/image` to reserve layout and prevent CLS.

## SEO

- `app/layout.tsx` exports `metadata` (title, description, OG, Twitter Card).
- Per-page metadata for `/work`, `/about`, `/contact`.
- `app/sitemap.ts` generates sitemap from portfolio data.
- JSON-LD `Photograph` + `ProfessionalService` snippet in `app/page.tsx`.

## Accessibility

- Skip link.
- Proper landmark roles (`header`, `main`, `nav`, `footer`).
- Lightbox: `role="dialog"`, `aria-modal`, trap focus, announce current item.
- Cards keyboard-activatable.
- Color contrast ≥ 4.5:1 for body text.

## Deployment

Will deploy to Vercel (free tier, best Next.js host). Env var hooks for future Resend/email. Domain hookup later.

## Out-of-scope follow-ups (named for later)

- Admin panel (`/admin`) with auth
- Client portal (`/clients/[slug]`) with per-client auth tokens, download ZIP
- Email integration for contact form (Resend)
- Blog (`/journal`)
- Booking calendar
- CMS integration (Sanity or Contentlayer)
