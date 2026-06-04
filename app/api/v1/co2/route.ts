import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date()

    // Use orders instead of shipments
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      select: {
        id: true,
        weightKg: true,
        createdAt: true
      }
    })

    const totalWeight = orders.reduce(
      (sum, order) => sum + (order.weightKg ?? 0),
      0
    )

    const estimatedCO2Kg = totalWeight * 0.12

    return NextResponse.json({
      success: true,
      period: {
        startDate,
        endDate
      },
      metrics: {
        totalOrders: orders.length,
        totalWeightKg: totalWeight,
        estimatedCO2Kg
      }
    })
  } catch (error) {
    console.error('CO2 calculation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to calculate CO2 emissions'
      },
      {
        status: 500
      }
    )
  }
}