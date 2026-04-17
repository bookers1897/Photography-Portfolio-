# Book & Capture — Phase 3 Design: Media Management + Admin UI

## Context

Phase 1 (public site) and phase 2 (gallery polish) shipped with hardcoded media in `lib/portfolio.ts`. The user needs to manage the portfolio entirely through the UI — drag-and-drop uploads, album management, reordering — the way Pixieset or SmugMug handle it. This phase replaces the static data source with a live database + object storage, and introduces an admin panel protected by authentication.

Authentication was originally slotted as phase 5, but it's a hard prerequisite for the admin UI (we can't leave `/admin` open to the internet). We build the admin-only flow now; phase 5 adds the client tier on top.

## Stack (locked)

- **Next.js 16 on Vercel** — unchanged from phase 1
- **Supabase Postgres** — `albums`, `media`, `profiles` tables
- **Supabase Storage** — `media` bucket (public reads, admin-only writes)
- **Supabase Auth** — email/password, JWT-based, SSR-compatible via `@supabase/ssr`
- **Row-Level Security (RLS)** — authoritative authorization at the database layer

## Data Model

```sql
-- profiles: extends auth.users with role
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- albums: public-facing portfolio albums
create table albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  cover_media_id uuid references media(id),
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- media: image/video items belonging to an album
create table media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  storage_path text not null,            -- 'media/abc-123.jpg'
  poster_path text,                      -- video thumbnail
  name text not null,
  alt text,
  width integer not null,
  height integer not null,
  position integer not null default 0,
  published boolean not null default true,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);
```

### RLS policies (summary)

- `albums` + `media`: anyone can `select` where `published = true`; only admins can `insert/update/delete`
- `profiles`: users can read their own row; admins can read/update all
- Storage bucket `media`: public read; admins write

## Routes

| Route | Who | Purpose |
|-------|-----|---------|
| `/` `/work` `/work/[album]` `/about` `/contact` | public | unchanged; now reads from Supabase |
| `/login` | public | email/password sign-in + magic link |
| `/admin` | admin only | dashboard — album list, recent uploads |
| `/admin/albums` | admin only | create / rename / reorder / publish |
| `/admin/albums/[slug]` | admin only | album editor: drag-drop upload, reorder, metadata, delete |
| `/admin/settings` | admin only | brand info, hero image picker |

## Upload Flow

1. Admin drops files into the dropzone (react-dropzone).
2. Client requests a signed upload URL from Supabase Storage (direct upload — file never touches the Next.js server).
3. File streams to Supabase Storage at `media/{album_id}/{uuid}.{ext}`.
4. On success, server action extracts dimensions:
   - **Images:** `probe-image-size` on the uploaded buffer, or read from dimensions header after upload
   - **Videos:** generate poster from first frame using a background worker OR ask the admin to upload a poster alongside (simpler v1)
5. Insert row in `media` table with `album_id`, `type`, `storage_path`, etc.
6. UI optimistically shows the new tile.

For v1, posters for videos are uploaded manually (a "poster" slot on the video's upload card). Automatic frame extraction gets added in a later iteration.

## Admin Auth (v1)

- Email/password via Supabase Auth; `@supabase/ssr` handles cookie-based sessions so server components can read the user.
- Middleware at `middleware.ts` refreshes the session on every request and redirects `/admin/*` → `/login` if not authenticated.
- On first deploy, admin role is bootstrapped via a SQL seed that sets `role = 'admin'` for `sbeezy99@gmail.com`.
- Phase 5 layers client-tier auth: private gallery URLs, per-client access lists, download gating.

## File Layout

```
app/
  admin/
    layout.tsx              server-side auth guard
    page.tsx                dashboard
    albums/
      page.tsx              list + create
      [slug]/page.tsx       album editor
    actions.ts              server actions: createAlbum, deleteMedia, ...
  login/
    page.tsx
    actions.ts
  (public site unchanged)
components/
  admin/
    dropzone.tsx            drag-drop client component
    media-grid-editor.tsx   sortable + reorder
    album-form.tsx
lib/
  supabase/
    server.ts               createClient for server components
    client.ts               createClient for client components
    middleware.ts           session refresh helper
  portfolio.ts              KEEP as server fetcher, now queries Supabase
supabase/
  migrations/
    0001_init.sql           schema + RLS + bucket
    0002_seed.sql           migrates current hardcoded data
middleware.ts               refresh session + protect /admin
```

## What I need from the user

To build against Supabase I need a project created with keys exposed to the dev environment. The user does this once from the Supabase dashboard:

1. Sign up at https://supabase.com with `sbeezy99@gmail.com`
2. Create project "book-and-capture" (any region close to US)
3. From **Project Settings → API**, copy:
   - Project URL (e.g. `https://xxxx.supabase.co`)
   - `anon` public key
   - `service_role` secret key (treated as a secret; never committed)
4. Paste those three values back in chat — I'll drop them into `.env.local` (which is already gitignored).

I run all the SQL migrations via the Supabase SQL editor and wire up the app code from there.

## Deferred to phase 4/5

- Deploying to Vercel + pointing `bookandcapture` domain (phase 4)
- Automatic video poster extraction (later)
- Client-tier auth, per-client galleries, download tracking (phase 5)
- Image cropping/color correction UI (later)
- Bulk ZIP download for clients (phase 5)

## Verification

- `npm run dev` and visit `/admin` — redirects to `/login` when signed out
- Sign in as admin → can create album, drop files, see them appear in `/work`
- Sign out and hit `/admin` again — redirects
- Run `npm run build` to confirm server actions compile for production
