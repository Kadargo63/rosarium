-- Backfill country_of_origin for original 33 seed roses
-- Run AFTER 005_rose_catalog.sql

update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Voodoo';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Neil Diamond';
update rose_entities set country_of_origin = 'France'           where canonical_name = 'Peace';
update rose_entities set country_of_origin = 'Germany'          where canonical_name = 'Sunsprite';
update rose_entities set country_of_origin = 'Germany'          where canonical_name = 'Parfuma Bliss';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Paradise';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Fragrant Plum';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Broadway';
update rose_entities set country_of_origin = 'France'           where canonical_name = 'Touch of Class';
update rose_entities set country_of_origin = 'Germany'          where canonical_name = 'Blue Girl';
update rose_entities set country_of_origin = 'Germany'          where canonical_name = 'Lagerfeld';
update rose_entities set country_of_origin = 'New Zealand'      where canonical_name = 'Olympiad';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Gold Medal';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Double Delight';
update rose_entities set country_of_origin = 'France'           where canonical_name = 'Miss All-American Beauty';
update rose_entities set country_of_origin = 'France'           where canonical_name = 'Love and Peace';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Sweet and Sassy';
update rose_entities set country_of_origin = 'France'           where canonical_name = 'Zephirine Drouhin';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Pinata';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Golden Showers';
update rose_entities set country_of_origin = 'Italy'            where canonical_name = 'Don Juan';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Mister Lincoln';
update rose_entities set country_of_origin = 'Germany'          where canonical_name = 'Tropicana';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Henry Fonda';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Perfume Delight';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Royal American';

-- Remaining original seed roses
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'True Spirit';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'True Serenity';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'True Passion';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Martha Stewart';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'New Day';
update rose_entities set country_of_origin = 'United States'    where canonical_name = 'Tropical Lightning';