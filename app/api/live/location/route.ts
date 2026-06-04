import { NextRequest, NextResponse } from 'next/server'
import { redis, STREAMS, publishToStream } from '@/lib/redis'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { vehicleId, driverId, lat, lng, speed, heading } = await req.json()

    const locationData = {
      vehicleId,
      driverId,
      lat,
      lng,
      speed,
      heading,
      timestamp: Date.now()
    }

    await publishToStream(STREAMS.VEHICLE_LOCATIONS, locationData)

    // Update in database
    try {
      console.log(
        `Vehicle ${vehicleId} updated at ${lat}, ${lng}`
      )

      // Uncomment and adapt if your Vehicle model supports it
      /*
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          lastLatitude: lat,
          lastLongitude: lng,
          updatedAt: new Date()
        }
      })
      */
    } catch (dbError) {
      console.log('Vehicle location update skipped:', dbError)
    }

    return NextResponse.json({
      success: true,
      timestamp: locationData.timestamp
    })
  } catch (error) {
    console.error('Location update error:', error)

    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    )
  }
}

