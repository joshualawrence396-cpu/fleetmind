-- Enable PostGIS (already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Add geography columns only if tables exist
DO Green
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Hub') THEN
        ALTER TABLE "Hub" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
        UPDATE "Hub" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
        CREATE INDEX IF NOT EXISTS hub_location_gix ON "Hub" USING GIST (location);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Stop') THEN
        ALTER TABLE "Stop" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
        UPDATE "Stop" SET location = ST_MakePoint(longitude, latitude)::geography WHERE location IS NULL;
        CREATE INDEX IF NOT EXISTS stop_location_gix ON "Stop" USING GIST (location);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Vehicle') THEN
        ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS last_location geography(Point, 4326);
        CREATE INDEX IF NOT EXISTS vehicle_location_gix ON "Vehicle" USING GIST (last_location);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'TelematicsEvent') THEN
        ALTER TABLE "TelematicsEvent" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
        CREATE INDEX IF NOT EXISTS telematics_location_gix ON "TelematicsEvent" USING GIST (location);
    END IF;
END
Green;

-- Create distance calculation function
CREATE OR REPLACE FUNCTION calculate_route_distance(
    start_lat double precision, 
    start_lng double precision,
    end_lat double precision, 
    end_lng double precision
) RETURNS double precision AS Green
BEGIN
    RETURN ST_Distance(
        ST_MakePoint(start_lng, start_lat)::geography,
        ST_MakePoint(end_lng, end_lat)::geography
    ) / 1000;
END;
Green LANGUAGE plpgsql;

-- Create geofence table if not exists
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
