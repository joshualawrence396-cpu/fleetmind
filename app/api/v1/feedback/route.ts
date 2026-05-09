import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, rating, comment, customerName } = await req.json()
    
    const feedback = await prisma.feedback.create({
      data: {
        shipmentId,
        rating,
        comment,
        customerName,
        status: 'PENDING'
      }
    })
    
    // Update driver rating average
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { stops: { include: { route: { include: { driver: true } } } } }
    })
    
    if (shipment?.stops[0]?.route?.driver) {
      const allFeedback = await prisma.feedback.findMany({
        where: {
          shipment: {
            stops: {
              some: {
                route: {
                  driverId: shipment.stops[0].route.driverId
                }
              }
            }
          }
        }
      })
      
      const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
      
      await prisma.driver.update({
        where: { id: shipment.stops[0].route.driverId },
        data: { rating: avgRating }
      })
    }
    
    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const driverId = searchParams.get('driverId')
    
    const feedback = await prisma.feedback.findMany({
      where: driverId ? {
        shipment: {
          stops: {
            some: {
              route: {
                driverId: driverId
              }
            }
          }
        }
      } : {},
      include: {
        shipment: {
          include: {
            order: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(feedback)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
