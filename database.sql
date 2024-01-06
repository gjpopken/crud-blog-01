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
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "delta" VARCHAR (3000)
);

-- Seed Data Template:
INSERT INTO "blogs"
  ("title", "body")
  VALUES
  ('A whole day at the cafe...', 'I have been here for a long time. I have run into a lot of problems, but I think I''ve solved them. This app took me a lot longer than I thought, 4 hours, then another 5. So, like 9? But it was a pretty involved app, so I don''t know, maybe that''s normal. It feels wild that it is done now. I didn''t eat much today, and I''m feeling hungry. I wonder what Foster has been up to today. Maybe we''ll have leftovers for dinner. I should eat a lot. I''m proud, I worked out at a gym I''ve never been to before, and did all the exercises I wanted to. The equipment there wasn''t as nice as in Minneapolis, but their bathrooms and space were a lot bigger and nicer. Odd juxtaposition. Now I have an hour left, I wonder what I will do? I have to merge everything, and will check ChatGPT to see if I have anything else I need to add before I go onto stretch goals.'),
  ('the next day', 'I"m learning so much every day!');
  
SELECT * FROM "blogs" ORDER BY "id" DESC LIMIT 1;
SELECT * FROM "blogs" WHERE "id" = 31;

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

