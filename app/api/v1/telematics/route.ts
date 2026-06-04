import { NextRequest, NextResponse } from 'next/server'
import { STREAMS, publishToStream } from '@/lib/redis'
import { telematicsAdapters } from '@/lib/telematics/adapters'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { provider, data } = await req.json()

    const providerKey = String(provider ?? '').toLowerCase()

    if (!(providerKey in telematicsAdapters)) {
      return NextResponse.json(
        {
          error: 'Unknown telematics provider'
        },
        {
          status: 400
        }
      )
    }

    const adapter =
      telematicsAdapters[
        providerKey as keyof typeof telematicsAdapters
      ]

    const event = adapter.parseEvent(data)
    const alerts = adapter.checkAlerts(event)

    await publishToStream(
      STREAMS.VEHICLE_LOCATIONS,
      event
    )

    for (const alert of alerts) {
      try {
        if ('telematicsAlert' in prisma) {
          await (prisma as any).telematicsAlert.create({
            data: {
              vehicleId: event.vehicleId,
              type: alert.type,
              severity: alert.severity,
              payload: alert,
              createdAt: alert.timestamp
            }
          })
        }
      } catch (err) {
        console.log(
          'Alert save skipped:',
          err
        )
      }

      await publishToStream(
        STREAMS.ALERTS,
        alert
      )
    }

    console.log(
      `Telematics event received for vehicle ${event.vehicleId}`
    )

    return NextResponse.json({
      success: true,
      alerts: alerts.length,
      timestamp: event.timestamp
    })
  } catch (error) {
    console.error(
      'Telematics ingestion error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to ingest telematics data'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET(
  req: NextRequest
) {
  try {
    const { searchParams } = new URL(
      req.url
    )

    const vehicleId =
      searchParams.get('vehicleId')

    const hours = parseInt(
      searchParams.get('hours') ?? '24',
      10
    )

    return NextResponse.json({
      vehicleId,
      hours,
      message:
        'Telemetry endpoint active',
      data: []
    })
  } catch (error) {
    console.error(
      'Telemetry fetch error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch telemetry'
      },
      {
        status: 500
      }
    )
  }
}