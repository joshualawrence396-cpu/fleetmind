import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Get driver ID from session (simplified - in production use auth)
    const driverId = req.headers.get('x-driver-id')
    
    if (!driverId) {
      return NextResponse.json({ error: 'Driver not authenticated' }, { status: 401 })
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const route = await prisma.route.findFirst({
      where: {
        driverId: driverId,
        date: today,
        status: { in: ['ASSIGNED', 'IN_PROGRESS'] }
      },
      include: {
        stops: {
          where: { status: { not: 'COMPLETED' } },
          orderBy: { sequence: 'asc' }
        }
      }
    })
    
    if (!route) {
      return NextResponse.json(null)
    }
    
    const stopsWithDetails = await Promise.all(route.stops.map(async (stop) => {
      let customerName = ''
      if (stop.shipmentId) {
        const shipment = await prisma.shipment.findUnique({
          where: { id: stop.shipmentId },
          include: { order: true }
        })
        customerName = shipment?.order?.recipientName || ''
      }
      
      return {
        id: stop.id,
        sequence: stop.sequence,
        type: stop.type,
        address: stop.address,
        customerName,
        status: stop.status
      }
    }))
    
    return NextResponse.json({
      id: route.id,
      stops: stopsWithDetails,
      totalStops: route.stops.length
    })
  } catch (error) {
    console.error('Error fetching route:', error)
    return NextResponse.json({ error: 'Failed to fetch route' }, { status: 500 })
  }
}
