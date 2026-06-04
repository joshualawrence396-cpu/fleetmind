import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const hubId = searchParams.get('hubId')

    const historicalOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    const totalOrders = historicalOrders.length

    const forecast = {
      hubId,
      totalHistoricalOrders: totalOrders,
      projectedOrdersNext30Days: Math.round(totalOrders * 1.1),
      confidence: 75
    }

    return NextResponse.json({
      success: true,
      forecast
    })
  } catch (error) {
    console.error('Forecasting error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate forecast'
      },
      {
        status: 500
      }
    )
  }
}