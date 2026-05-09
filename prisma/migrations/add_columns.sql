-- Add columns if they don't exist (ignore errors if tables don't exist)
DO \$\$
BEGIN
    BEGIN
        ALTER TABLE "Hub" ADD COLUMN location geography(Point, 4326);
        EXCEPTION WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE "Stop" ADD COLUMN location geography(Point, 4326);
        EXCEPTION WHEN duplicate_column THEN NULL;
    END;
    BEGIN
        ALTER TABLE "Vehicle" ADD COLUMN last_location geography(Point, 4326);
        EXCEPTION WHEN duplicate_column THEN NULL;
    END;
END \$\$;
