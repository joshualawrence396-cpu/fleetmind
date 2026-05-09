// ClickHouse HTTP client for heavy analytics
const CLICKHOUSE_HOST = process.env.CLICKHOUSE_HOST || 'http://localhost:8123'

export async function queryClickHouse(sql: string): Promise<any[]> {
  try {
    const response = await fetch(CLICKHOUSE_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql })
    })
    
    return await response.json()
  } catch (error) {
    console.error('ClickHouse query error:', error)
    return []
  }
}

// Create telematics analytics table
export async function initClickHouse() {
  const createTable = 
    CREATE TABLE IF NOT EXISTS telematics_analytics (
      timestamp DateTime,
      vehicle_id String,
      speed Float32,
      latitude Float64,
      longitude Float64,
      fuel_level Float32,
      ignition UInt8,
      event_type String
    ) ENGINE = MergeTree()
    ORDER BY timestamp
  
  
  await queryClickHouse(createTable)
}

// Insert analytics data
export async function insertTelematicsAnalytics(events: any[]) {
  if (events.length === 0) return
  
  const values = events.map(e => 
    ('', '', , , , , , '')
  ).join(',')
  
  const sql = INSERT INTO telematics_analytics (timestamp, vehicle_id, speed, latitude, longitude, fuel_level, ignition, event_type) VALUES 
  await queryClickHouse(sql)
}

// Get fleet analytics
export async function getFleetAnalytics(startDate: Date, endDate: Date) {
  const sql = 
    SELECT 
      toStartOfHour(timestamp) as hour,
      count() as total_events,
      avg(speed) as avg_speed,
      max(speed) as max_speed,
      avg(fuel_level) as avg_fuel,
      countIf(ignition = 1) as active_time
    FROM telematics_analytics
    WHERE timestamp >= ''
      AND timestamp <= ''
    GROUP BY hour
    ORDER BY hour
  
  
  return await queryClickHouse(sql)
}
