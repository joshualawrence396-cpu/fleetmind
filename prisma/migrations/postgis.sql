-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Add geography columns to existing tables
ALTER TABLE "Hub" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE "Hub" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
CREATE INDEX IF NOT EXISTS hub_location_gix ON "Hub" USING GIST (location);

ALTER TABLE "Stop" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE "Stop" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
CREATE INDEX IF NOT EXISTS stop_location_gix ON "Stop" USING GIST (location);

ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS last_location geography(Point, 4326);
CREATE INDEX IF NOT EXISTS vehicle_location_gix ON "Vehicle" USING GIST (last_location);

-- Function to calculate distance between two points in kilometers
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 float, lon1 float, 
    lat2 float, lon2 float
) RETURNS float AS Green
BEGIN
    RETURN ST_Distance(
        ST_MakePoint(lon1, lat1)::geography,
        ST_MakePoint(lon2, lat2)::geography
    ) / 1000;
END;
Green LANGUAGE plpgsql;
