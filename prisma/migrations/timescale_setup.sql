CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE TABLE IF NOT EXISTS telematics_events (
    time TIMESTAMPTZ NOT NULL,
    vehicle_id TEXT,
    speed FLOAT,
    latitude FLOAT,
    longitude FLOAT,
    fuel_level FLOAT,
    ignition BOOLEAN,
    event_type TEXT
);
SELECT create_hypertable('telematics_events', 'time', if_not_exists => TRUE);
