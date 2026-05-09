ALTER TABLE IF EXISTS "Hub" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
ALTER TABLE IF EXISTS "Stop" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
ALTER TABLE IF EXISTS "Vehicle" ADD COLUMN IF NOT EXISTS last_location geography(Point, 4326);