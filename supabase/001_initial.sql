-- Rosarium Database Schema
-- Run this in Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Rose entities (canonical catalog, shared across all users)
create table if not exists rose_entities (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  ars_registration_name text,
  breeder_code text,
  class_code text,
  color_code text,
  growth_type text check (growth_type in ('hybrid_tea','floribunda','climber','shrub','polyantha','grandiflora','miniature','old_garden')),
  pruning_model text check (pruning_model in ('NEW_GROWTH_DOMINANT','MIXED_CANE','OLD_WOOD_SENSITIVE')),
  plant_structure_type text not null default 'cane' check (plant_structure_type in ('cane','stem_cluster','vine_runner','woody_branch')),
  year_introduced int,
  species text default 'Rosa x hybrida',
  notes text,
  created_at timestamptz default now()
);

-- Rose aliases (trade names, nursery names, mislabels)
create table if not exists rose_aliases (
  id uuid primary key default gen_random_uuid(),
  rose_id uuid references rose_entities(id) on delete cascade,
  alias text not null,
  alias_type text check (alias_type in ('trade','nursery','common','mislabel')),
  confidence float default 1.0
);
create index if not exists idx_rose_aliases_rose_id on rose_aliases(rose_id);

-- Gardens
create table if not exists gardens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location_notes text,
  sun_index text check (sun_index in ('EARLY_SOFT','MID_BALANCED','LATE_INTENSE')),
  user_id uuid,
  created_at timestamptz default now()
);

-- Plants (individual instances in a garden)
create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  rose_id uuid references rose_entities(id),
  garden_id uuid references gardens(id),
  label_name text not null,
  position_index int,
  date_planted date,
  notes text,
  sun_index text check (sun_index in ('EARLY_SOFT','MID_BALANCED','LATE_INTENSE')),
  user_id uuid,
  created_at timestamptz default now()
);
create index if not exists idx_plants_garden_id on plants(garden_id);
create index if not exists idx_plants_rose_id on plants(rose_id);

-- Logs (append-only weekly performance)
create table if not exists logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade,
  date date not null default current_date,
  vigor int check (vigor between 1 and 5),
  health int check (health between 1 and 5),
  bloom_stage text check (bloom_stage in ('dormant','budding','bud','half_open','open','fully_open','spent','hip_forming')),
  stem_quality int check (stem_quality between 1 and 5),
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_logs_plant_id on logs(plant_id);
create index if not exists idx_logs_date on logs(date);

-- Photos
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade,
  log_id uuid references logs(id) on delete set null,
  image_url text not null,
  taken_at timestamptz default now(),
  notes text
);
create index if not exists idx_photos_plant_id on photos(plant_id);

-- Feedback (public, no auth required)
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id) on delete cascade,
  log_id uuid references logs(id) on delete set null,
  author_name text,
  rating int check (rating between 1 and 5),
  tags text[] default '{}',
  comment text,
  honeypot text,
  created_at timestamptz default now()
);
create index if not exists idx_feedback_plant_id on feedback(plant_id);

-- RLS Policies (written now, enabled when auth is added in Phase 2)
-- alter table plants enable row level security;
-- alter table logs enable row level security;
-- alter table photos enable row level security;
-- alter table gardens enable row level security;
-- Feedback is always public read/write by design
