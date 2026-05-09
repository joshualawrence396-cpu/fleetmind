import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = new Date(searchParams.get('start') || '')
    const endDate = new Date(searchParams.get('end') || '')
    
    // Calculate CO2 emissions from shipments
    const shipments = await prisma.shipment.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: 'DELIVERED'
      }
    })
    
    // Rough estimate: 0.2 kg CO2 per km per parcel
    const totalEmissions = shipments.reduce((sum, s) => sum + (s.weightKg * 0.2), 0)
    
    return NextResponse.json({
      period: { start: startDate, end: endDate },
      totalShipments: shipments.length,
      totalCO2Kg: totalEmissions.toFixed(2),
      offsetCost: (totalEmissions * 0.05).toFixed(2) // .05 per kg CO2
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate CO2' }, { status: 500 })
  }
}
