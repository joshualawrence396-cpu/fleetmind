CREATE TABLE IF NOT EXISTS "TelematicsEvent" (
    id TEXT PRIMARY KEY,
    "vehicleId" TEXT,
    timestamp TIMESTAMP NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    speedKmh DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    ignition BOOLEAN,
    "fuelLevelPct" DOUBLE PRECISION,
    "odometerKm" DOUBLE PRECISION,
    "engineRpm" INTEGER,
    "rawData" JSONB,
    location geography(Point, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);
