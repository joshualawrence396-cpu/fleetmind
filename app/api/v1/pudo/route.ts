import { NextRequest, NextResponse } from 'next/server'

const PUDO_LOCATIONS = [
  { id: 'PUDO-001', name: 'Cape Town Central', lat: -33.9249, lng: 18.4241, available: true },
  { id: 'PUDO-002', name: 'Century City', lat: -33.8889, lng: 18.5093, available: true },
  { id: 'PUDO-003', name: 'Bellville', lat: -33.9062, lng: 18.6305, available: true }
]

export async function GET() {
  return NextResponse.json(PUDO_LOCATIONS)
}

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, pudoId, customerEmail } = await req.json()
    const pudo = PUDO_LOCATIONS.find(p => p.id === pudoId)
    
    if (!pudo) {
      return NextResponse.json({ error: 'PUDO location not found' }, { status: 404 })
    }
    
    // Redirect shipment to PUDO locker
    return NextResponse.json({
      success: true,
      message: Package will be delivered to ,
      pickupCode: PUDO-,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to redirect to PUDO' }, { status: 500 })
  }
}
