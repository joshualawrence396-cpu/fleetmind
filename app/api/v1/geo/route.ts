import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { originLat, originLng, destLat, destLng } = await req.json()
    
    // Use PostGIS for real distance calculation
    const result = await prisma.
      SELECT calculate_distance(
        , ,
        , 
      ) as distance_km
    
    
    return NextResponse.json({ 
      distance: result[0].distance_km,
      unit: 'km'
    })
  } catch (error) {
    console.error('Geospatial error:', error)
    return NextResponse.json({ error: 'Failed to calculate distance' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const hubId = searchParams.get('hubId')
    
    // Find nearby hubs within 50km
    if (hubId) {
      const hub = await prisma.hub.findUnique({ where: { id: hubId } })
      if (!hub) return NextResponse.json({ error: 'Hub not found' }, { status: 404 })
      
      const nearby = await prisma.
        SELECT id, name, code, 
               calculate_distance(
                 , ,
                 latitude, longitude
               ) as distance_km
        FROM "Hub"
        WHERE id != 
        ORDER BY distance_km
        LIMIT 10
      
      return NextResponse.json(nearby)
    }
    
    return NextResponse.json({ error: 'Hub ID required' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to find nearby hubs' }, { status: 500 })
  }
}
