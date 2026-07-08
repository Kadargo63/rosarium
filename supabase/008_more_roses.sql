-- Additional Rose Catalog — Popular varieties not in 005
-- Run AFTER 005_rose_catalog.sql

insert into rose_entities
  (canonical_name, breeder_code, class_code, color_code, growth_type, pruning_model, plant_structure_type, year_introduced, country_of_origin, species)
values

-- David Austin additions
('Charles Darwin',          'AUS', 'S',  'dy', 'shrub',   'MIXED_CANE', 'cane', 2001, 'England', 'Rosa x hybrida'),
('Lady Emma Hamilton',      'AUS', 'S',  'ob', 'shrub',   'MIXED_CANE', 'cane', 2005, 'England', 'Rosa x hybrida'),
('Crown Princess Margareta','AUS', 'S',  'ab', 'climber', 'MIXED_CANE', 'cane', 1999, 'England', 'Rosa x hybrida'),
('The Generous Gardener',   'AUS', 'S',  'lp', 'climber', 'MIXED_CANE', 'cane', 2002, 'England', 'Rosa x hybrida'),
('Malvern Hills',           'AUS', 'S',  'my', 'climber', 'MIXED_CANE', 'cane', 2000, 'England', 'Rosa x hybrida'),
('Harlow Carr',             'AUS', 'S',  'dp', 'shrub',   'MIXED_CANE', 'cane', 2004, 'England', 'Rosa x hybrida'),
('Tranquillity',            'AUS', 'S',  'w',  'shrub',   'MIXED_CANE', 'cane', 2014, 'England', 'Rosa x hybrida'),
('Young Lycidas',           'AUS', 'S',  'dp', 'shrub',   'MIXED_CANE', 'cane', 2008, 'England', 'Rosa x hybrida'),
('Princess Anne',           'AUS', 'S',  'dp', 'shrub',   'MIXED_CANE', 'cane', 2010, 'England', 'Rosa x hybrida'),
('Molineux',                'AUS', 'S',  'dy', 'shrub',   'MIXED_CANE', 'cane', 1994, 'England', 'Rosa x hybrida'),
('The Dark Lady',           'AUS', 'S',  'dr', 'shrub',   'MIXED_CANE', 'cane', 1991, 'England', 'Rosa x hybrida'),
('Claire Austin',           'AUS', 'S',  'w',  'climber', 'MIXED_CANE', 'cane', 2007, 'England', 'Rosa x hybrida'),
('Wollerton Old Hall',      'AUS', 'S',  'ab', 'climber', 'MIXED_CANE', 'cane', 2011, 'England', 'Rosa x hybrida'),
('Emily Bronte',            'AUS', 'S',  'ab', 'shrub',   'MIXED_CANE', 'cane', 2013, 'England', 'Rosa x hybrida'),
('James L. Austin',         'AUS', 'S',  'mp', 'shrub',   'MIXED_CANE', 'cane', 2013, 'England', 'Rosa x hybrida'),
('Eustacia Vye',            'AUS', 'S',  'ab', 'shrub',   'MIXED_CANE', 'cane', 2016, 'England', 'Rosa x hybrida'),
('Queen of Sweden',         'AUS', 'S',  'lp', 'shrub',   'MIXED_CANE', 'cane', 2004, 'England', 'Rosa x hybrida'),
('The Lady Gardener',       'AUS', 'S',  'ab', 'shrub',   'MIXED_CANE', 'cane', 2010, 'England', 'Rosa x hybrida'),
('Port Sunlight',           'AUS', 'S',  'ab', 'shrub',   'MIXED_CANE', 'cane', 2007, 'England', 'Rosa x hybrida'),

-- Popular HTs not yet in catalog
('Bride''s Dream',          'KOR', 'HT', 'lp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1985, 'Germany',       'Rosa x hybrida'),
('Signature',               'JAC', 'HT', 'dp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1996, 'United States', 'Rosa x hybrida'),
('Honor',                   'JAC', 'HT', 'w',  'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1980, 'United States', 'Rosa x hybrida'),
('Bewitched',               null,  'HT', 'mp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1967, 'United States', 'Rosa x hybrida'),
('Electron',                null,  'HT', 'dp', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1970, 'Northern Ireland', 'Rosa x hybrida'),
('Gemini',                  null,  'HT', 'pb', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1999, 'United States', 'Rosa x hybrida'),

-- Popular Floribundas
('Burgundy Iceberg',        null,  'F',  'dr', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 1984, 'Australia',     'Rosa x hybrida'),
('Climbing Fabulous',       'WEK', 'Cl F','w', 'climber',    'MIXED_CANE',          'cane', 2007, 'United States', 'Rosa x hybrida'),
('Ebb Tide',                'WEK', 'F',  'm',  'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2004, 'United States', 'Rosa x hybrida'),
('Honey Perfume',           'JAC', 'F',  'ab', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2004, 'United States', 'Rosa x hybrida'),
('Sunrosa Yellow',          null,  'S',  'dy', 'shrub',      'NEW_GROWTH_DOMINANT', 'cane', 2006, 'France',        'Rosa x hybrida')

on conflict (canonical_name) do nothing;