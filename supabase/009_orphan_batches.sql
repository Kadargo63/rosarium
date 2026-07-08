-- Orphan propagation batch support
-- Allows batches from wild/unlisted plants (parent_plant_id nullable)
-- Run AFTER 007_propagation_batches.sql

alter table propagation_batches
  alter column parent_plant_id drop not null,
  add column if not exists batch_label text; -- name for orphan batches (no parent plant)