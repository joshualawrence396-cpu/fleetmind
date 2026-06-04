import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const {
      shipmentId,
      temperature,
      humidity,
      timestamp
    } = await req.json()

    const isOutOfRange =
      temperature < -20 || temperature > -10

    await prisma.coldChainRecord.create({
      data: {
        shipmentId,
        temperature,
        humidity: humidity ?? null,
        timestamp: timestamp
          ? new Date(timestamp)
          : new Date(),
        isOutOfRange
      }
    })

    if (isOutOfRange) {
      await prisma.alert.create({
        data: {
          type: 'COLD_CHAIN_BREACH',
          severity: 'HIGH',
          shipmentId,
          message: `Temperature breach: ${temperature}°C (range: -20°C to -10°C)`
        }
      })
    }

    return NextResponse.json({
      success: true,
      isOutOfRange
    })
  } catch (error) {
    console.error('Cold chain error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to record cold chain data'
      },
      {
        status: 500
      }
    )
  }
}