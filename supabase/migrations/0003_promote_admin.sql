-- Promote Bookers1897@gmail.com to admin (case-insensitive).
-- Creates the profile row if the signup trigger didn't fire.
-- Safe to re-run.

insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where lower(email) = lower('Bookers1897@gmail.com')
on conflict (id) do update
  set role = 'admin',
      email = excluded.email;
