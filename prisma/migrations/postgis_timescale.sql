-- Enable PostGIS and TimescaleDB extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Add geography columns to tables
ALTER TABLE "Hub" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE "Hub" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
CREATE INDEX IF NOT EXISTS hub_location_gix ON "Hub" USING GIST (location);

ALTER TABLE "Stop" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE "Stop" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
CREATE INDEX IF NOT EXISTS stop_location_gix ON "Stop" USING GIST (location);

ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS last_location geography(Point, 4326);
CREATE INDEX IF NOT EXISTS vehicle_location_gix ON "Vehicle" USING GIST (last_location);

ALTER TABLE "TelematicsEvent" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
CREATE INDEX IF NOT EXISTS telematics_location_gix ON "TelematicsEvent" USING GIST (location);

-- Create TimescaleDB hypertable for telematics
SELECT create_hypertable('"TelematicsEvent"', 'timestamp', if_not_exists => TRUE);

-- Create geofence table
CREATE TABLE IF NOT EXISTS "Geofence" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    polygon geometry(Polygon, 4326),
    center geometry(Point, 4326),
    radius INT,
    type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS geofence_polygon_gix ON "Geofence" USING GIST (polygon);

-- Distance calculation function
CREATE OR REPLACE FUNCTION calculate_route_distance(
    start_lat float, start_lng float,
    end_lat float, end_lng float
) RETURNS float AS Green
BEGIN
    RETURN ST_Distance(
        ST_MakePoint(start_lng, start_lat)::geography,
        ST_MakePoint(end_lng, end_lat)::geography
    ) / 1000;
END;
Green LANGUAGE plpgsql;
