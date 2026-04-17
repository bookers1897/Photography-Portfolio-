-- Book & Capture — initial schema
-- Run this once in the Supabase SQL Editor.

-- =========================================================================
-- EXTENSIONS
-- =========================================================================
create extension if not exists "pgcrypto";

-- =========================================================================
-- TABLES
-- =========================================================================

-- profiles: extends auth.users with role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

-- albums: public-facing portfolio albums
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  cover_media_id uuid,
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- media: image/video items belonging to an album
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  storage_path text not null,
  poster_path text,
  name text not null,
  alt text,
  width integer not null,
  height integer not null,
  position integer not null default 0,
  published boolean not null default true,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- deferred FK: album cover references media
alter table public.albums
  drop constraint if exists albums_cover_media_id_fkey;
alter table public.albums
  add constraint albums_cover_media_id_fkey
  foreign key (cover_media_id) references public.media(id) on delete set null;

create index if not exists media_album_position_idx
  on public.media (album_id, position);

create index if not exists albums_position_idx
  on public.albums (position);

-- =========================================================================
-- updated_at trigger on albums
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists albums_set_updated_at on public.albums;
create trigger albums_set_updated_at
  before update on public.albums
  for each row execute function public.set_updated_at();

-- =========================================================================
-- auto-create profile row when a new auth user signs up
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'client')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- helper: is_admin()
-- =========================================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.albums   enable row level security;
alter table public.media    enable row level security;

-- profiles: users read their own row; admins read/update all
drop policy if exists "profiles self read"         on public.profiles;
drop policy if exists "profiles admin read all"    on public.profiles;
drop policy if exists "profiles admin update all"  on public.profiles;

create policy "profiles self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles admin read all"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles admin update all"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- albums: anyone reads published; admins do everything
drop policy if exists "albums public read published" on public.albums;
drop policy if exists "albums admin all"             on public.albums;

create policy "albums public read published"
  on public.albums for select
  using (published = true or public.is_admin());

create policy "albums admin all"
  on public.albums for all
  using (public.is_admin())
  with check (public.is_admin());

-- media: anyone reads published; admins do everything
drop policy if exists "media public read published" on public.media;
drop policy if exists "media admin all"             on public.media;

create policy "media public read published"
  on public.media for select
  using (published = true or public.is_admin());

create policy "media admin all"
  on public.media for all
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================
-- STORAGE BUCKET: media (public read, admin write)
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media bucket public read"   on storage.objects;
drop policy if exists "media bucket admin write"   on storage.objects;
drop policy if exists "media bucket admin update"  on storage.objects;
drop policy if exists "media bucket admin delete"  on storage.objects;

create policy "media bucket public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media bucket admin write"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket admin update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media bucket admin delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
