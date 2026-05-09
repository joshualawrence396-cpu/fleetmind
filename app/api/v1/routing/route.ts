import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { coordinates, profile = 'driving' } = await req.json()
    
    if (!coordinates || coordinates.length < 2) {
      return NextResponse.json({ error: 'At least 2 coordinates required' }, { status: 400 })
    }
    
    // Calculate distance using Haversine formula (fallback)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    }
    
    let totalDistance = 0
    let totalDuration = 0
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const dist = calculateDistance(
        coordinates[i][1], coordinates[i][0],
        coordinates[i+1][1], coordinates[i+1][0]
      )
      totalDistance += dist
      totalDuration += (dist / 40) * 60 // Assume 40 km/h average speed
    }
    
    return NextResponse.json({
      distance: totalDistance,
      duration: totalDuration,
      coordinates: coordinates
    })
    
  } catch (error) {
    console.error('Routing error:', error)
    return NextResponse.json({ error: 'Failed to calculate route' }, { status: 500 })
  }
}
