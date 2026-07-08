-- Modern roses catalog (2015-2024) and notable varieties missing from earlier migrations
-- Run AFTER 008_more_roses.sql

insert into rose_entities
  (canonical_name, breeder_code, class_code, color_code, growth_type, pruning_model, plant_structure_type, year_introduced, country_of_origin, species)
values

-- Modern David Austin (2015-2024)
('The Pilgrim',          'AUS', 'S',  'ly', 'shrub',   'MIXED_CANE', 'cane', 1991, 'England', 'Rosa x hybrida'),
('Olivia Rose Austin',   'AUS', 'S',  'mp', 'shrub',   'MIXED_CANE', 'cane', 2014, 'England', 'Rosa x hybrida'),
('Darcey Bussell',       'AUS', 'S',  'mr', 'shrub',   'MIXED_CANE', 'cane', 2006, 'England', 'Rosa x hybrida'),
('Boscobel',             'AUS', 'S',  'or', 'shrub',   'MIXED_CANE', 'cane', 2012, 'England', 'Rosa x hybrida'),
('Strawberry Hill',      'AUS', 'S',  'lp', 'climber', 'MIXED_CANE', 'cane', 2006, 'England', 'Rosa x hybrida'),
('Tottering-by-Gently',  'AUS', 'S',  'mp', 'shrub',   'MIXED_CANE', 'cane', 2021, 'England', 'Rosa x hybrida'),
('Bathsheba',            'AUS', 'S',  'ab', 'climber', 'MIXED_CANE', 'cane', 2016, 'England', 'Rosa x hybrida'),
('Darcey Bussell',       'AUS', 'S',  'mr', 'shrub',   'MIXED_CANE', 'cane', 2006, 'England', 'Rosa x hybrida'),
('Hyde Hall',            'AUS', 'S',  'dp', 'shrub',   'MIXED_CANE', 'cane', 2004, 'England', 'Rosa x hybrida'),

-- Modern HTs & Floribundas (Kordes, Weeks, others)
('Frida Kahlo',          'KOR', 'F',  'ob', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2019, 'Germany',       'Rosa x hybrida'),
('About Face',           'WEK', 'G',  'ob', 'grandiflora','NEW_GROWTH_DOMINANT', 'cane', 2004, 'United States', 'Rosa x hybrida'),
('Strike It Rich',       'WEK', 'G',  'yb', 'grandiflora','NEW_GROWTH_DOMINANT', 'cane', 2007, 'United States', 'Rosa x hybrida'),
('Wild Blue Yonder',     'WEK', 'G',  'm',  'grandiflora','NEW_GROWTH_DOMINANT', 'cane', 2006, 'United States', 'Rosa x hybrida'),
('At Last',              'WEK', 'F',  'ab', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2012, 'United States', 'Rosa x hybrida'),
('Desmond Tutu',         'KOR', 'F',  'or', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2004, 'Germany',       'Rosa x hybrida'),
('Koko Loko',            'WEK', 'F',  'ab', 'floribunda', 'NEW_GROWTH_DOMINANT', 'cane', 2014, 'United States', 'Rosa x hybrida'),
('Mr. Lincoln',          null,  'HT', 'mr', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 1964, 'United States', 'Rosa x hybrida'),
('Climbing Don Juan',    null,  'Cl HT','mr','climber',    'MIXED_CANE',          'cane', 1958, 'Italy',         'Rosa x hybrida'),
('Neptune',              'WEK', 'HT', 'm',  'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 2003, 'United States', 'Rosa x hybrida'),
('Marilyn Monroe',       'WEK', 'HT', 'ab', 'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 2002, 'United States', 'Rosa x hybrida'),
('Henry Kelsey',         null,  'S',  'mr', 'shrub',      'MIXED_CANE',          'cane', 1984, 'Canada',        'Rosa x hybrida'),
('William Baffin',       null,  'S',  'dp', 'climber',    'MIXED_CANE',          'cane', 1983, 'Canada',        'Rosa x hybrida'),
('John Cabot',           null,  'S',  'dp', 'climber',    'MIXED_CANE',          'cane', 1978, 'Canada',        'Rosa x hybrida'),
('Morden Blush',         null,  'S',  'lp', 'shrub',      'NEW_GROWTH_DOMINANT', 'cane', 1988, 'Canada',        'Rosa x hybrida'),
('Winnipeg Parks',       null,  'S',  'dp', 'shrub',      'NEW_GROWTH_DOMINANT', 'cane', 1990, 'Canada',        'Rosa x hybrida'),
('Polareis',             'KOR', 'S',  'w',  'shrub',      'NEW_GROWTH_DOMINANT', 'cane', 2010, 'Germany',       'Rosa x hybrida'),
('Lions Rose',           'KOR', 'HT', 'w',  'hybrid_tea', 'NEW_GROWTH_DOMINANT', 'cane', 2002, 'Germany',       'Rosa x hybrida'),
('Carding Mill',         'AUS', 'S',  'ab', 'shrub',      'MIXED_CANE',          'cane', 2005, 'England',       'Rosa x hybrida'),
('The Mayflower',        'AUS', 'S',  'mp', 'shrub',      'MIXED_CANE',          'cane', 2001, 'England',       'Rosa x hybrida'),
('Wisley 2008',          'AUS', 'S',  'lp', 'shrub',      'MIXED_CANE',          'cane', 2008, 'England',       'Rosa x hybrida'),
('Sweet Juliet',         'AUS', 'S',  'ab', 'shrub',      'MIXED_CANE',          'cane', 1989, 'England',       'Rosa x hybrida'),
('Wild Edric',           'AUS', 'S',  'dp', 'shrub',      'MIXED_CANE',          'cane', 2004, 'England',       'Rosa x hybrida'),
('Benjamin Britten',     'AUS', 'S',  'or', 'shrub',      'MIXED_CANE',          'cane', 2001, 'England',       'Rosa x hybrida'),
('Teasing Georgia',      'AUS', 'S',  'my', 'climber',    'MIXED_CANE',          'cane', 1998, 'England',       'Rosa x hybrida')

on conflict (canonical_name) do nothing;