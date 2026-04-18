-- Book & Capture — seed initial albums and promote first admin
-- Run this AFTER 0001_init.sql AND after Bookers1897@gmail.com has signed up
-- (from the /login page). This migration is idempotent.

-- Promote the admin user (case-insensitive; also creates the profile
-- row if the on_auth_user_created trigger didn't fire).
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('Bookers1897@gmail.com')
on conflict (id) do update
  set role = 'admin',
      email = excluded.email;

-- Seed empty albums in display order
insert into public.albums (slug, name, description, position, published) values
  ('editorial',    'Editorial',    'Magazine-ready narratives and signature looks.', 0, true),
  ('beauty',       'Beauty',       'Skin, light, and intimate detail.',              1, true),
  ('lifestyle',    'Lifestyle',    'Real moments, cinematic light.',                 2, true),
  ('portraits',    'Portraits',    'People, presence, and personality.',             3, true),
  ('commissioned', 'Commissioned', 'Campaign and brand work.',                       4, true),
  ('motion',       'Motion',       'Short-form video and cinematic clips.',          5, true)
on conflict (slug) do nothing;
