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
      await prisma.
        UPDATE "Vehicle" 
        SET last_location = ST_SetSRID(ST_MakePoint(, ), 4326)::geography
        WHERE id = 
      
    } catch (dbError) {
      console.log('PostGIS update skipped (extension may not be enabled)')
    }
    
    return NextResponse.json({ success: true, timestamp: locationData.timestamp })
  } catch (error) {
    console.error('Location update error:', error)
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}
