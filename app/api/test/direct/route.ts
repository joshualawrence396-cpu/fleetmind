import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    const client = await pool.connect()

    const result = await client.query(`
      SELECT calculate_route_distance(
        -33.9249,
        18.4241,
        -33.9229,
        18.3859
      ) AS distance
    `)

    client.release()

    const distance = result.rows[0]?.distance || 0

    return NextResponse.json({
      success: true,
      postgis_working: true,
      distance_km: parseFloat(distance),
      message: 'PostGIS is working!',
    })
  } catch (error: any) {
    console.error('Test endpoint error:', error)

    return NextResponse.json({
      success: false,
      postgis_working: false,
      error: error?.message || 'Unknown error',
      distance_km: 3.5,
      message: 'Using fallback distance calculation',
    })
  }
}