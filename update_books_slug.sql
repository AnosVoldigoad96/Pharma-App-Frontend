-- Add slug column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS slug text;

-- Create a function to slugify text
CREATE OR REPLACE FUNCTION slugify("value" text)
RETURNS text AS $$
  -- lower case
  WITH "lowercase" AS (
    SELECT lower("value") AS "value"
  ),
  -- remove accents
  "removed_accents" AS (
    SELECT translate("value", 'àáâäãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;', 'aaaaaaaaacccddeeeeeeeegghiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------') AS "value"
    FROM "lowercase"
  ),
  -- replace invalid chars with -
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9 -]', '', 'g') AS "value"
    FROM "removed_accents"
  ),
  -- collapse whitespace and dashes
  "collapsed" AS (
    SELECT regexp_replace(regexp_replace("value", '\s+', '-', 'g'), '-+', '-', 'g') AS "value"
    FROM "hyphenated"
  )
  SELECT trim(both '-' from "value") FROM "collapsed";
$$ LANGUAGE sql STRICT IMMUTABLE;

-- Update existing books with slugs
UPDATE books SET slug = slugify(title) WHERE slug IS NULL;

-- Make slug required and unique
ALTER TABLE books ALTER COLUMN slug SET NOT NULL;
ALTER TABLE books ADD CONSTRAINT books_slug_key UNIQUE (slug);
