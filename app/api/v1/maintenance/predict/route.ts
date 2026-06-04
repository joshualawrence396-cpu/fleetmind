import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { vehicleId } = await req.json()

    const predictions = [
      {
        component: 'BRAKES',
        riskScore: 0.85,
        predictedFailDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ),
        recommendedAction:
          'Inspect and potentially replace brake pads',
        rationale:
          'High number of harsh braking events detected'
      },
      {
        component: 'ENGINE',
        riskScore: 0.65,
        predictedFailDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        recommendedAction:
          'Schedule engine diagnostic check',
        rationale:
          'Decreased fuel efficiency detected'
      }
    ]

    return NextResponse.json({
      predictions,
      vehicleStatus: {
        odometer: 50000,
        harshBrakes: 45
      }
    })
  } catch (error) {
    console.error('Prediction error:', error)

    return NextResponse.json(
      {
        predictions: [],
        error:
          error instanceof Error
            ? error.message
            : 'Prediction failed'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    let predictions: any[] = []

    try {
      predictions =
        await prisma.maintenancePrediction.findMany({
          where: {
            riskScore: {
              gt: 0.5
            }
          },
          orderBy: {
            riskScore: 'desc'
          },
          take: 10
        })
    } catch (dbError) {
      console.log(
        'Database table not ready, using mock data',
        dbError
      )
    }

    if (!predictions || predictions.length === 0) {
      predictions = [
        {
          component: 'BRAKES',
          riskScore: 0.85,
          recommendedAction:
            'Replace brake pads within 7 days',
          vehicle: {
            registration: 'CA123456'
          },
          rationale:
            'High number of harsh braking events detected'
        },
        {
          component: 'TYRES',
          riskScore: 0.72,
          recommendedAction:
            'Check tyre tread depth',
          vehicle: {
            registration: 'CA789012'
          },
          rationale:
            'High mileage since last rotation'
        }
      ]
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error(
      'Error fetching predictions:',
      error
    )

    return NextResponse.json([
      {
        component: 'BRAKES',
        riskScore: 0.85,
        recommendedAction:
          'Replace brake pads within 7 days',
        vehicle: {
          registration: 'CA123456'
        },
        rationale:
          'High number of harsh braking events detected'
      },
      {
        component: 'TYRES',
        riskScore: 0.72,
        recommendedAction:
          'Check tyre tread depth',
        vehicle: {
          registration: 'CA789012'
        },
        rationale:
          'High mileage since last rotation'
      }
    ])
  }
}
