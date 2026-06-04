import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const body = await request.json()

    const vehicle = await prisma.vehicle.update({
      where: {
        id
      },
      data: {
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        status: body.status || 'ON_ROUTE'
      },
      include: {
        driver: true
      }
    })

    try {
      if ('telematicsEvent' in prisma) {
        await (prisma as any).telematicsEvent.create({
          data: {
            vehicleId: id,
            latitude: parseFloat(body.latitude),
            longitude: parseFloat(body.longitude)
          }
        })
      }
    } catch (eventError) {
      console.log(
        'Telematics event save skipped:',
        eventError
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error(
      'Vehicle location update error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update vehicle location'
      },
      {
        status: 500
      }
    )
  }
}