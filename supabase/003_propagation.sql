-- Propagation Tracking
-- Run AFTER 002_seed.sql
-- Tracks cutting/propagation status per plant for pre-move collection cloning

alter table plants
  add column if not exists propagation_status text
    not null default 'none'
    check (propagation_status in ('none', 'cutting_taken', 'propagated')),
  add column if not exists propagation_notes text;

create index if not exists idx_plants_propagation_status on plants(propagation_status);
