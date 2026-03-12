-- Beadcraft (拼豆工艺) Supabase schema
-- Run in Supabase SQL Editor (or via migrations).

-- Extensions
create extension if not exists pgcrypto;

-- Profiles: 1 row per auth user
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  gender text not null default 'Other' check (gender in ('Male', 'Female', 'Other')),
  avatar text not null default '',
  bio text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Saved projects from the editor ("我的图纸")
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  width int not null check (width >= 1 and width <= 64),
  height int not null check (height >= 1 and height <= 64),
  grid jsonb not null, -- array of (string|null)
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_updated_at_idx on public.projects(updated_at desc);

-- Pattern likes (for now, patterns are identified by string id from frontend mock list)
create table if not exists public.pattern_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  pattern_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, pattern_id)
);
create index if not exists pattern_likes_pattern_id_idx on public.pattern_likes(pattern_id);

-- Following authors (author is a display name string in current frontend)
create table if not exists public.following (
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, author_name)
);
create index if not exists following_author_name_idx on public.following(author_name);

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.pattern_likes enable row level security;
alter table public.following enable row level security;

-- Profiles policies
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
on public.profiles for select
using (auth.uid() = user_id);

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own"
on public.profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Projects policies
drop policy if exists "projects read own" on public.projects;
create policy "projects read own"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "projects insert own" on public.projects;
create policy "projects insert own"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "projects update own" on public.projects;
create policy "projects update own"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "projects delete own" on public.projects;
create policy "projects delete own"
on public.projects for delete
using (auth.uid() = user_id);

-- Likes policies
drop policy if exists "pattern_likes read own" on public.pattern_likes;
create policy "pattern_likes read own"
on public.pattern_likes for select
using (auth.uid() = user_id);

drop policy if exists "pattern_likes insert own" on public.pattern_likes;
create policy "pattern_likes insert own"
on public.pattern_likes for insert
with check (auth.uid() = user_id);

drop policy if exists "pattern_likes delete own" on public.pattern_likes;
create policy "pattern_likes delete own"
on public.pattern_likes for delete
using (auth.uid() = user_id);

-- Following policies
drop policy if exists "following read own" on public.following;
create policy "following read own"
on public.following for select
using (auth.uid() = user_id);

drop policy if exists "following insert own" on public.following;
create policy "following insert own"
on public.following for insert
with check (auth.uid() = user_id);

drop policy if exists "following delete own" on public.following;
create policy "following delete own"
on public.following for delete
using (auth.uid() = user_id);

