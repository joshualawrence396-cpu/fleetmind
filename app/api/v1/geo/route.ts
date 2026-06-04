import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { originLat, originLng, destLat, destLng } = await req.json()

    // Calculate distance using Haversine formula
    const R = 6371 // Earth radius in km

    const dLat = ((destLat - originLat) * Math.PI) / 180
    const dLng = ((destLng - originLng) * Math.PI) / 180

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return NextResponse.json({
      distance: Number(distance.toFixed(2)),
      unit: 'km'
    })
  } catch (error) {
    console.error('Geospatial error:', error)

    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const hubId = searchParams.get('hubId')

    if (!hubId) {
      return NextResponse.json(
        { error: 'Hub ID required' },
        { status: 400 }
      )
    }

    const hub = await prisma.hub.findUnique({
      where: { id: hubId }
    })

    if (!hub) {
      return NextResponse.json(
        { error: 'Hub not found' },
        { status: 404 }
      )
    }

    const hubs = await prisma.hub.findMany({
      where: {
        id: {
          not: hubId
        }
      }
    })

    const nearby = hubs
      .map((h) => {
        const dLat = ((h.latitude - hub.latitude) * Math.PI) / 180
        const dLng = ((h.longitude - hub.longitude) * Math.PI) / 180

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((hub.latitude * Math.PI) / 180) *
            Math.cos((h.latitude * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = 6371 * c

        return {
          id: h.id,
          name: h.name,
          code: h.code,
          distance_km: Number(distance.toFixed(2))
        }
      })
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, 10)

    return NextResponse.json(nearby)
  } catch (error) {
    console.error('Nearby hubs error:', error)

    return NextResponse.json(
      { error: 'Failed to find nearby hubs' },
      { status: 500 }
    )
  }
}