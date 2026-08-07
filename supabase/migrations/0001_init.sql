-- =============================================================
-- CropWise AI Care — initial schema
-- Run against your Supabase project via the SQL editor or:
--   supabase db push
-- =============================================================

-- ---------- profiles (mirrors auth.users) ----------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  full_name          text,
  preferred_language text not null default 'en'
                     check (preferred_language in ('en', 'hi', 'mr')),
  location           text,
  crop_preference    text,
  created_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- diseases (curated library) ----------
create table if not exists public.diseases (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  crop               text not null,
  pathogen           text,
  severity           text check (severity in ('low', 'medium', 'high')),
  symptoms           jsonb not null default '[]',
  causes             jsonb not null default '[]',
  organic_treatments jsonb not null default '[]',
  chemical_treatments jsonb not null default '[]',
  prevention         jsonb not null default '[]',
  image_url          text,
  -- { en: {...}, hi: {...}, mr: {...} } — English is source of truth
  translations       jsonb not null default '{}',
  created_at         timestamptz not null default now()
);

alter table public.diseases enable row level security;

create policy "Public read diseases"
  on public.diseases for select
  using (true);

-- ---------- diagnoses (history) ----------
create table if not exists public.diagnoses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users (id) on delete cascade,
  image_url    text,
  disease_id   uuid references public.diseases (id) on delete set null,
  disease_name text,
  confidence   numeric check (confidence >= 0 and confidence <= 1),
  severity     text check (severity in ('low', 'medium', 'high')),
  status       text not null default 'completed'
               check (status in ('pending', 'completed', 'failed')),
  created_at   timestamptz not null default now()
);

create index if not exists diagnoses_user_created_idx
  on public.diagnoses (user_id, created_at desc);

alter table public.diagnoses enable row level security;

create policy "Users can view own diagnoses"
  on public.diagnoses for select
  using (auth.uid() = user_id);

create policy "Users can create diagnoses"
  on public.diagnoses for insert
  with check (auth.uid() = user_id);

-- ---------- treatment_plans (checkable timeline) ----------
create table if not exists public.treatment_plans (
  id           uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses (id) on delete cascade,
  -- [{order, title, description, completed}]
  steps        jsonb not null default '[]',
  created_at   timestamptz not null default now()
);

alter table public.treatment_plans enable row level security;

create policy "Users can view own treatment plans"
  on public.treatment_plans for select
  using (
    exists (
      select 1 from public.diagnoses d
      where d.id = treatment_plans.diagnosis_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can create treatment plans"
  on public.treatment_plans for insert
  with check (
    exists (
      select 1 from public.diagnoses d
      where d.id = treatment_plans.diagnosis_id
        and d.user_id = auth.uid()
    )
  );

-- ---------- agri_centres (locator seed data) ----------
create table if not exists public.agri_centres (
  id      uuid primary key default gen_random_uuid(),
  name    text not null,
  type    text not null
          check (type in ('krishi_kendra', 'soil_lab', 'input_dealer', 'other')),
  address text,
  phone   text,
  lat     double precision not null,
  lng     double precision not null,
  hours   text,
  created_at timestamptz not null default now()
);

create index if not exists agri_centres_lat_lng_idx
  on public.agri_centres (lat, lng);

alter table public.agri_centres enable row level security;

create policy "Public read agri centres"
  on public.agri_centres for select
  using (true);
