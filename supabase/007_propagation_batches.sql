-- Propagation Batch Tracking
-- Run AFTER 006_backfill_origin.sql
-- Tracks cutting batches from a parent plant through to rooted specimens

create table if not exists propagation_batches (
  id uuid primary key default gen_random_uuid(),
  parent_plant_id uuid references plants(id) on delete cascade,
  batch_code text not null,           -- short printable tag code e.g. "VOO-0708"
  date_taken date not null default current_date,
  initial_count int not null default 1,
  notes text,
  status text not null default 'active'
    check (status in ('active', 'complete', 'abandoned')),
  created_at timestamptz default now()
);

create table if not exists propagation_batch_updates (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references propagation_batches(id) on delete cascade,
  update_date date not null default current_date,
  viable_count int,      -- cuttings still alive and looking good
  failed_count int,      -- removed as dead/failed
  rooted_count int,      -- confirmed rooted with new growth
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_prop_batches_plant on propagation_batches(parent_plant_id);
create index if not exists idx_prop_batches_status on propagation_batches(status);
create index if not exists idx_prop_batch_updates_batch on propagation_batch_updates(batch_id);