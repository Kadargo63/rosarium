-- Rose Metadata Extension
-- Run AFTER 003_propagation.sql

alter table rose_entities
  add column if not exists country_of_origin text;