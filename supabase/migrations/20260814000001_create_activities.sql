create table public.activities (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),

  started_at        timestamptz not null,
  ended_at          timestamptz not null,
  duration_seconds  integer not null,

  -- ordered [lng, lat] pairs, e.g. [[4.895, 52.370], [4.896, 52.371], ...]
  route_points      jsonb not null,
  distance_meters   numeric not null default 0,

  -- anonymous-first, auth-ready attribution
  user_id           uuid references auth.users(id) on delete set null,   -- null until auth ships
  device_id         text,                                                 -- anonymous client-generated id

  notes             text,
  photo_url         text,                                                 -- Supabase Storage public URL
  is_hidden         boolean not null default false                        -- moderation hook, cheap to add now
);

create index activities_created_at_idx on public.activities (created_at desc);
create index activities_user_id_idx on public.activities (user_id);
create index activities_device_id_idx on public.activities (device_id);

alter table public.activities enable row level security;

create policy "Anyone can read activities"
  on public.activities for select
  using (is_hidden = false);

create policy "Anyone can insert activities"
  on public.activities for insert
  with check (true);
-- No update/delete policy yet — add narrower ones (owner or device_id match) when needed.
