-- Create telemetry events table
CREATE TABLE IF NOT EXISTS telematics_events (
    time TIMESTAMPTZ NOT NULL,
    vehicle_id TEXT NOT NULL,
    device_id TEXT,
    speed FLOAT,
    latitude FLOAT,
    longitude FLOAT,
    altitude FLOAT,
    heading FLOAT,
    fuel_level FLOAT,
    engine_temp FLOAT,
    battery_voltage FLOAT,
    ignition BOOLEAN,
    odometer FLOAT,
    event_type TEXT,
    raw_data JSONB
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('telematics_events', 'time', if_not_exists => TRUE);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_telematics_vehicle_time ON telematics_events (vehicle_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_telematics_time ON telematics_events (time DESC);

-- Create compression policy (compress data older than 7 days)
ALTER TABLE telematics_events SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'vehicle_id',
    timescaledb.compress_orderby = 'time DESC'
);

SELECT add_compression_policy('telematics_events', INTERVAL '7 days', if_not_exists => TRUE);
