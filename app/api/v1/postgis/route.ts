import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const lat1 = parseFloat(
      searchParams.get('lat1') || '-33.9249'
    )

    const lng1 = parseFloat(
      searchParams.get('lng1') || '18.4241'
    )

    const lat2 = parseFloat(
      searchParams.get('lat2') || '-33.9229'
    )

    const lng2 = parseFloat(
      searchParams.get('lng2') || '18.3859'
    )

    const client = await pool.connect()

    let distance = 0

    try {
      const result = await client.query(
        'SELECT get_distance($1, $2, $3, $4) AS distance',
        [lat1, lng1, lat2, lng2]
      )

      distance = Number(
        result.rows[0]?.distance ?? 0
      )
    } catch (err) {
      // Fallback: Haversine formula
      const R = 6371

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180

      const dLon =
        ((lng2 - lng1) * Math.PI) / 180

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        )

      distance = R * c
    } finally {
      client.release()
    }

    return NextResponse.json({
      success: true,
      distance_km: distance,
      from: {
        lat: lat1,
        lng: lng1,
      },
      to: {
        lat: lat2,
        lng: lng2,
      },
    })
  } catch (error) {
    console.error(
      'PostGIS API error:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
      {
        status: 500,
      }
    )
  }
}