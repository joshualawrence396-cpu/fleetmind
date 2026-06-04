import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const driverId = searchParams.get('driverId')

    const drivers = driverId
      ? await prisma.driver.findMany({
          where: {
            id: driverId
          }
        })
      : await prisma.driver.findMany()

    const performance = drivers.map((driver) => {
      const rating =
        typeof driver.rating === 'number'
          ? driver.rating
          : 0

      return {
        driverId: driver.id,
        name: driver.name,
        totalDeliveries: 0,
        onTimeRate: 0,
        avgRating: rating.toFixed(1),
        efficiencyScore: ((rating / 5) * 100).toFixed(1),
        status: driver.status
      }
    })

    performance.sort(
      (a, b) =>
        parseFloat(b.efficiencyScore) -
        parseFloat(a.efficiencyScore)
    )

    return NextResponse.json(performance)
  } catch (error) {
    console.error('Performance error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get performance data'
      },
      {
        status: 500
      }
    )
  }
}