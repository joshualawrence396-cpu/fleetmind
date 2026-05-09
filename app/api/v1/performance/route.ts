import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const driverId = searchParams.get('driverId')
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const drivers = driverId 
      ? await prisma.driver.findMany({ where: { id: driverId } })
      : await prisma.driver.findMany()
    
    const performance = await Promise.all(drivers.map(async (driver) => {
      // Get driver's completed deliveries
      const deliveries = await prisma.shipment.count({
        where: {
          stops: {
            some: {
              route: { driverId: driver.id },
              status: 'COMPLETED'
            }
          },
          actualDeliveryAt: { gte: startDate }
        }
      })
      
      // Get on-time performance
      const onTime = await prisma.shipment.count({
        where: {
          stops: { some: { route: { driverId: driver.id } } },
          actualDeliveryAt: { lte: new Date() }
        }
      })
      
      // Get customer ratings
      const feedback = await prisma.feedback.findMany({
        where: {
          shipment: {
            stops: { some: { route: { driverId: driver.id } } }
          }
        }
      })
      
      const avgRating = feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
        : 0
      
      // Calculate efficiency score
      const efficiencyScore = deliveries > 0 
        ? ((onTime / deliveries) * 0.5 + (avgRating / 5) * 0.5) * 100 
        : 0
      
      return {
        driverId: driver.id,
        name: driver.fullName,
        totalDeliveries: deliveries,
        onTimeRate: deliveries > 0 ? (onTime / deliveries) * 100 : 0,
        avgRating: avgRating.toFixed(1),
        efficiencyScore: efficiencyScore.toFixed(1),
        status: driver.status
      }
    }))
    
    // Sort by efficiency score
    performance.sort((a, b) => parseFloat(b.efficiencyScore) - parseFloat(a.efficiencyScore))
    
    return NextResponse.json(performance)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get performance data' }, { status: 500 })
  }
}
