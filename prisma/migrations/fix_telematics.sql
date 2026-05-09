-- Add missing columns to match Prisma schema
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS "vehicleId" TEXT;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS speedKmh DOUBLE PRECISION;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS heading DOUBLE PRECISION;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS ignition BOOLEAN;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS "fuelLevelPct" DOUBLE PRECISION;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS "odometerKm" DOUBLE PRECISION;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS "engineRpm" INTEGER;
ALTER TABLE telematics_events ADD COLUMN IF NOT EXISTS "rawData" JSONB;

-- Create index for vehicle queries
CREATE INDEX IF NOT EXISTS idx_telematics_vehicle ON telematics_events ("vehicleId", "time" DESC);
