import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const originLat = parseFloat(searchParams.get('originLat') || '0')
    const originLng = parseFloat(searchParams.get('originLng') || '0')
    const destLat = parseFloat(searchParams.get('destLat') || '0')
    const destLng = parseFloat(searchParams.get('destLng') || '0')
    
    // Calculate distance using Haversine formula
    const R = 6371 // Earth's radius in km
    const dLat = (destLat - originLat) * Math.PI / 180
    const dLon = (destLng - originLng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(originLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    // Estimate travel time based on average speed (30 km/h in city)
    const avgSpeed = 30 // km/h
    const estimatedMinutes = Math.ceil((distance / avgSpeed) * 60)
    
    // Add traffic multiplier based on time of day
    const hour = new Date().getHours()
    let trafficMultiplier = 1.0
    if (hour >= 7 && hour <= 9) trafficMultiplier = 1.5 // Morning rush
    if (hour >= 16 && hour <= 19) trafficMultiplier = 1.5 // Evening rush
    
    const etaMinutes = Math.ceil(estimatedMinutes * trafficMultiplier)
    
    return NextResponse.json({
      origin: { lat: originLat, lng: originLng },
      destination: { lat: destLat, lng: destLng },
      distance: distance.toFixed(2),
      estimatedMinutes: etaMinutes,
      estimatedArrival: new Date(Date.now() + etaMinutes * 60000).toISOString(),
      trafficFactor: trafficMultiplier
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate ETA' }, { status: 500 })
  }
}
