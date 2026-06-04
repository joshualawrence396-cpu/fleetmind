// ClickHouse HTTP client for heavy analytics

const CLICKHOUSE_HOST =
  process.env.CLICKHOUSE_HOST || "http://localhost:8123";

export async function queryClickHouse(sql: string): Promise<any[]> {
  try {
    const response = await fetch(CLICKHOUSE_HOST, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: sql,
    });

    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return [];
    }
  } catch (error) {
    console.error("ClickHouse query error:", error);
    return [];
  }
}

// Create telematics analytics table
export async function initClickHouse(): Promise<void> {
  const createTable = `
    CREATE TABLE IF NOT EXISTS telematics_analytics (
      timestamp DateTime,
      vehicle_id String,
      speed Float32,
      latitude Float64,
      longitude Float64,
      fuel_level Float32,
      ignition UInt8,
      event_type String
    )
    ENGINE = MergeTree()
    ORDER BY timestamp
  `;

  await queryClickHouse(createTable);
}

type TelematicsEvent = {
  timestamp: string;
  vehicle_id: string;
  speed: number;
  latitude: number;
  longitude: number;
  fuel_level: number;
  ignition: number;
  event_type: string;
};

// Insert analytics data
export async function insertTelematicsAnalytics(
  events: TelematicsEvent[]
): Promise<void> {
  if (events.length === 0) return;

  const values = events
    .map(
      (e) =>
        `(
          '${e.timestamp}',
          '${e.vehicle_id}',
          ${e.speed},
          ${e.latitude},
          ${e.longitude},
          ${e.fuel_level},
          ${e.ignition},
          '${e.event_type}'
        )`
    )
    .join(",");

  const sql = `
    INSERT INTO telematics_analytics
    (
      timestamp,
      vehicle_id,
      speed,
      latitude,
      longitude,
      fuel_level,
      ignition,
      event_type
    )
    VALUES ${values}
  `;

  await queryClickHouse(sql);
}

// Get fleet analytics
export async function getFleetAnalytics(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const sql = `
    SELECT
      toStartOfHour(timestamp) AS hour,
      count() AS total_events,
      avg(speed) AS avg_speed,
      max(speed) AS max_speed,
      avg(fuel_level) AS avg_fuel,
      countIf(ignition = 1) AS active_time
    FROM telematics_analytics
    WHERE timestamp >= '${startDate.toISOString()}'
      AND timestamp <= '${endDate.toISOString()}'
    GROUP BY hour
    ORDER BY hour
  `;

  return await queryClickHouse(sql);
}
