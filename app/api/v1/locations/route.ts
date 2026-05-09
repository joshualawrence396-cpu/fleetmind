import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Store driver locations in memory (use Redis in production)
const driverLocations = new Map()

export async function POST(req: NextRequest) {
  try {
    const { driverId, lat, lng, timestamp } = await req.json()
    
    driverLocations.set(driverId, {
      lat,
      lng,
      timestamp: timestamp || Date.now(),
      lastUpdate: new Date().toISOString()
    })
    
    // Update driver's last known location in database
    await prisma.driver.update({
      where: { id: driverId },
      data: { 
        lastLatitude: lat,
        lastLongitude: lng,
        lastLocationUpdate: new Date()
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const driverId = searchParams.get('driverId')
  
  if (driverId) {
    const location = driverLocations.get(driverId)
    return NextResponse.json(location || null)
  }
  
  // Return all active driver locations
  const allLocations = Array.from(driverLocations.entries()).map(([id, loc]) => ({
    driverId: id,
    ...loc
  }))
  
  return NextResponse.json(allLocations)
}
