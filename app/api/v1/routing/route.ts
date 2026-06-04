import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const {
      coordinates,
      profile = 'driving'
    }: {
      coordinates: number[][]
      profile?: string
    } = await req.json()

    if (!coordinates || coordinates.length < 2) {
      return NextResponse.json(
        {
          error: 'At least 2 coordinates required'
        },
        {
          status: 400
        }
      )
    }

    // Haversine distance in kilometers
    const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      const R = 6371

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180

      const dLon =
        ((lon2 - lon1) * Math.PI) / 180

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos(
          (lat1 * Math.PI) / 180
        ) *
          Math.cos(
            (lat2 * Math.PI) / 180
          ) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        )

      return R * c
    }

    let totalDistance = 0
    let totalDuration = 0

    for (
      let i = 0;
      i < coordinates.length - 1;
      i++
    ) {
      const current = coordinates[i]
      const next = coordinates[i + 1]

      const dist = calculateDistance(
        current[1],
        current[0],
        next[1],
        next[0]
      )

      totalDistance += dist

      // Assume average speed of 40 km/h
      totalDuration += (dist / 40) * 60
    }

    return NextResponse.json({
      profile,
      distance: totalDistance,
      duration: totalDuration,
      coordinates
    })
  } catch (error) {
    console.error(
      'Routing error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to calculate route'
      },
      {
        status: 500
      }
    )
  }
}