-- These two lines make it so that every single SQL query in
-- this file can be ran all at once to "reset" the database:
DROP TRIGGER IF EXISTS "on_things_update" ON "blogs";
DROP TABLE IF EXISTS "blogs";

-- Table Schema Template:
CREATE TABLE "blogs" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(500) NOT NULL,
  "body" VARCHAR(3000) NOT NULL,
  "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Data Template:
INSERT INTO "blogs"
  ("title", "body")
  VALUES
  ('My new blog', 'Here is what I have to say today!'),
  ('the next day', 'I"m learning so much every day!');
  
SELECT * FROM "blogs" ORDER BY "id" DESC LIMIT 1;

UPDATE "blogs" SET "title" = 'My life to date', "body" = 'my life to date has been ideal', "updated_at" = now() WHERE "id" = 25;
  
-- Creates a trigger that handles the updated_at magic:
  -- https://x-team.com/blog/automatic-timestamps-with-postgresql/
CREATE OR REPLACE FUNCTION set_updated_at_to_now()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_things_update
BEFORE UPDATE ON "blogs"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

