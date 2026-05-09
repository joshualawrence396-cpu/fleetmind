-- Enable PostGIS extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Create distance calculation function
CREATE OR REPLACE FUNCTION calculate_route_distance(
    start_lat double precision, 
    start_lng double precision,
    end_lat double precision, 
    end_lng double precision
) RETURNS double precision AS Now restart your Next.js server: npm run dev
BEGIN
    RETURN ST_Distance(
        ST_MakePoint(start_lng, start_lat)::geography,
        ST_MakePoint(end_lng, end_lat)::geography
    ) / 1000;
END;
Now restart your Next.js server: npm run dev LANGUAGE plpgsql;

-- Add geography columns (ignore errors if tables don't exist yet)
ALTER TABLE "Hub" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
ALTER TABLE "Stop" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS last_location geography(Point, 4326);
ALTER TABLE "TelematicsEvent" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Create indexes if tables exist
DO Now restart your Next.js server: npm run dev
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Hub') THEN
        CREATE INDEX IF NOT EXISTS hub_location_gix ON "Hub" USING GIST (location);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Stop') THEN
        CREATE INDEX IF NOT EXISTS stop_location_gix ON "Stop" USING GIST (location);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'Vehicle') THEN
        CREATE INDEX IF NOT EXISTS vehicle_location_gix ON "Vehicle" USING GIST (last_location);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'TelematicsEvent') THEN
        CREATE INDEX IF NOT EXISTS telematics_location_gix ON "TelematicsEvent" USING GIST (location);
    END IF;
END
Now restart your Next.js server: npm run dev;

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
