CREATE EXTENSION IF NOT EXISTS timescaledb;
SELECT create_hypertable('"TelematicsEvent"', 'timestamp', if_not_exists => TRUE);
