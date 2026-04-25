-- Book & Capture — site_settings singleton.
-- Stores admin-controlled site settings: home hero image, focal point,
-- and overlay darkness. Single-row pattern via boolean primary key
-- so the row is always addressable as `id = true`.
-- Safe to re-run.

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  hero_media_id uuid references public.media(id) on delete set null,
  hero_focal_x numeric not null default 50 check (hero_focal_x between 0 and 100),
  hero_focal_y numeric not null default 50 check (hero_focal_y between 0 and 100),
  hero_overlay numeric not null default 0.35 check (hero_overlay between 0 and 1),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
drop policy if exists "site_settings admin write" on public.site_settings;

create policy "site_settings public read"
  on public.site_settings for select
  using (true);

create policy "site_settings admin write"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
