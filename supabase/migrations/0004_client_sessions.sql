-- Book & Capture — two-tier auth: private client session albums.
-- Extends public.albums with visibility + owner_id + expires_at so that
-- a "client session" is just an album with visibility='private'.
-- Safe to re-run (idempotent).

-- =========================================================================
-- SCHEMA ADDITIONS
-- =========================================================================
alter table public.albums
  add column if not exists visibility text not null default 'public'
    check (visibility in ('public', 'private'));

alter table public.albums
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

alter table public.albums
  add column if not exists expires_at timestamptz;

create index if not exists albums_owner_idx
  on public.albums (owner_id)
  where visibility = 'private';

-- =========================================================================
-- RLS: replace album + media SELECT policies to honor visibility/owner/expiry
-- =========================================================================
drop policy if exists "albums public read published" on public.albums;
drop policy if exists "albums read"                  on public.albums;

create policy "albums read"
  on public.albums for select
  using (
    public.is_admin()
    or (visibility = 'public' and published = true)
    or (
      visibility = 'private'
      and owner_id = auth.uid()
      and (expires_at is null or expires_at > now())
    )
  );

drop policy if exists "media public read published" on public.media;
drop policy if exists "media read"                  on public.media;

create policy "media read"
  on public.media for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.albums a
      where a.id = media.album_id
        and (
          (a.visibility = 'public' and a.published = true and media.published = true)
          or (
            a.visibility = 'private'
            and a.owner_id = auth.uid()
            and (a.expires_at is null or a.expires_at > now())
          )
        )
    )
  );
