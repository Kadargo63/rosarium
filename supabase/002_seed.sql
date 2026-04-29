-- Rosarium Seed Data
-- Run AFTER 001_initial.sql

-- Gardens
insert into gardens (id, name, description, location_notes, sun_index) values
  ('00000000-0000-0000-0000-000000000001', 'North Wall', 'North-facing wall bed', 'Full exposure, some shade in afternoon', 'MID_BALANCED'),
  ('00000000-0000-0000-0000-000000000002', 'East Fence', 'Scent garden along east fence, right-to-left light gradient', 'Right=soft early light, Left=intense', 'EARLY_SOFT'),
  ('00000000-0000-0000-0000-000000000003', 'Front Garden', 'Hybrid Tea showcase row', 'South-facing, full sun', 'LATE_INTENSE'),
  ('00000000-0000-0000-0000-000000000004', 'Climbers', 'Climbing roses on structures and fences', 'Various', 'MID_BALANCED'),
  ('00000000-0000-0000-0000-000000000005', 'Sophie''s Garden', 'Sophie''s dedicated rose area', 'East-facing', 'EARLY_SOFT'),
  ('00000000-0000-0000-0000-000000000006', 'Saul''s Garden', 'Saul''s dedicated rose collection', 'South facing', 'MID_BALANCED'),
  ('00000000-0000-0000-0000-000000000007', 'Back Patio', 'Back patio climbing roses', 'West-facing afternoon sun', 'LATE_INTENSE')
on conflict do nothing;

-- Rose Entities
insert into rose_entities (id, canonical_name, breeder_code, class_code, color_code, growth_type, pruning_model, plant_structure_type, species) values
  ('10000000-0000-0000-0000-000000000001', 'Voodoo', 'JAC', 'HT', 'ob', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000002', 'True Spirit', null, 'HT', 'dr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000003', 'Neil Diamond', 'WEK', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000004', 'Peace', 'MEI', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000005', 'Sunsprite', 'KOR', 'F', 'dy', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000006', 'Parfuma Bliss', 'KOR', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000007', 'Paradise', 'JAC', 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000008', 'Martha Stewart', null, 'HT', 'lp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000009', 'Fragrant Plum', 'WEK', 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000010', 'Broadway', 'JAC', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000011', 'Touch of Class', null, 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000012', 'Blue Girl', 'TAN', 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000013', 'Lagerfeld', 'TAN', 'HT', 'lp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000014', 'True Serenity', null, 'HT', 'lp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000015', 'Olympiad', 'WEK', 'HT', 'dr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000016', 'True Passion', null, 'HT', 'dr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000017', 'Gold Medal', 'JAC', 'HT', 'dy', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000018', 'New Day', 'ARO', 'HT', 'ly', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000019', 'Perfume Factory', null, 'HT', 'dp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000020', 'Zephirine Drouhin', null, 'Cl B', 'mp', 'climber', 'MIXED_CANE', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000021', 'Pinata', 'WEK', 'Cl HT', 'ab', 'climber', 'MIXED_CANE', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000022', 'Golden Showers', null, 'Cl HT', 'dy', 'climber', 'MIXED_CANE', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000023', 'Don Juan', null, 'Cl HT', 'mr', 'climber', 'MIXED_CANE', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000024', 'Tropical Lightning', null, 'Cl HT', 'ab', 'climber', 'MIXED_CANE', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000025', 'Royal American', null, 'HT', 'dr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000026', 'Perfume Delight', null, 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000027', 'Mister Lincoln', null, 'HT', 'mr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000028', 'Tropicana', null, 'HT', 'ob', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000029', 'Henry Fonda', null, 'HT', 'dy', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000030', 'Double Delight', 'WEK', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000031', 'Miss All-American Beauty', null, 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000032', 'Love and Peace', 'MEI', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida'),
  ('10000000-0000-0000-0000-000000000033', 'Sweet and Sassy', 'WEK', 'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 'Rosa x hybrida')
on conflict do nothing;

-- Rose Aliases
insert into rose_aliases (rose_id, alias, alias_type, confidence) values
  ('10000000-0000-0000-0000-000000000001', 'Voodoo Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000004', 'Peace Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000005', 'Sunsprite Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000007', 'Paradise Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000012', 'Blue Girl Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000015', 'Olympiad Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000017', 'Gold Medal Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000020', 'Zephirine Drouhin Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000021', 'Pinata Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000021', 'Piñata', 'common', 0.95),
  ('10000000-0000-0000-0000-000000000021', 'Piñata Rose', 'nursery', 0.95),
  ('10000000-0000-0000-0000-000000000022', 'Golden Showers Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000023', 'Don Juan Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000024', 'Tropical Lightning Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000027', 'Mister Lincoln Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000028', 'Tropicana Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000030', 'Double Delight Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000031', 'Miss All-American Beauty Rose', 'nursery', 1.0),
  ('10000000-0000-0000-0000-000000000032', 'Love & Peace', 'trade', 1.0),
  ('10000000-0000-0000-0000-000000000033', 'Sweet & Sassy', 'trade', 1.0),
  ('10000000-0000-0000-0000-000000000033', 'Sweet and Sassy Rose', 'nursery', 0.9)
on conflict do nothing;

-- Plants - North Wall
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Voodoo Rose', 1, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'True Spirit Rose', 2, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Neil Diamond Rose', 3, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Peace Rose', 4, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Sunsprite Rose', 5, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Parfuma Bliss Rose', 6, 'MID_BALANCED');

-- Plants - East Fence (Scent Garden, R to L)
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'Paradise Rose', 1, 'EARLY_SOFT'),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 'Martha Stewart Rose', 2, 'EARLY_SOFT'),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', 'Fragrant Plum Rose', 3, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000002', 'Sweet and Sassy Rose', 4, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Broadway Rose', 5, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'Touch of Class Rose', 6, 'LATE_INTENSE');

-- Plants - Front Garden (HT Row)
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Blue Girl Rose #1', 1, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Blue Girl Rose #2', 2, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Blue Girl Rose #3', 3, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Blue Girl Rose #4', 4, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Blue Girl Rose #5', 5, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000003', 'Lagerfeld Rose', 6, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000003', 'True Serenity Rose', 7, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'True Spirit Rose (Front)', 8, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', 'Olympiad Rose #1', 9, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000003', 'Olympiad Rose #2', 10, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000003', 'True Passion Rose', 11, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000003', 'Gold Medal Rose', 12, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000003', 'New Day Rose', 13, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'Peace Rose (Front)', 14, 'LATE_INTENSE'),
  ('10000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000003', 'Perfume Factory Rose', 15, 'LATE_INTENSE');

-- Plants - Climbers
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000004', 'Zephirine Drouhin Rose', 1, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000004', 'Pinata Rose #1', 2, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000004', 'Pinata Rose #2', 3, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000004', 'Golden Showers Rose', 4, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000004', 'Don Juan Rose', 5, 'MID_BALANCED');

-- Plants - Back Patio (new climber)
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000007', 'Tropical Lightning Rose', 1, 'LATE_INTENSE');

-- Plants - Sophie''s Garden
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'Blue Girl Rose (Sophie #1)', 1, 'EARLY_SOFT'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'Blue Girl Rose (Sophie #2)', 2, 'EARLY_SOFT'),
  ('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000005', 'Pinata Rose (Sophie)', 3, 'EARLY_SOFT'),
  ('10000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000005', 'Royal American Rose', 4, 'EARLY_SOFT');

-- Plants - Saul''s Garden
insert into plants (rose_id, garden_id, label_name, position_index, sun_index) values
  ('10000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000006', 'Perfume Delight Rose', 1, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000006', 'Mister Lincoln Rose', 2, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000006', 'Tropicana Rose', 3, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000006', 'Henry Fonda Rose', 4, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', 'Blue Girl Rose (Saul)', 5, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'Lagerfeld Rose (Saul)', 6, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000006', 'True Serenity Rose (Saul)', 7, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000006', 'Double Delight Rose', 8, 'MID_BALANCED'),
  ('10000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000006', 'Miss All-American Beauty Rose', 9, 'MID_BALANCED');
