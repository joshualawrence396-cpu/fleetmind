import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const shipmentId = body.shipmentId ?? null
    const reason = body.reason

    if (!reason) {
      return NextResponse.json(
        {
          error: 'Reason is required'
        },
        {
          status: 400
        }
      )
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        shipmentId,
        reason,
        status: 'PENDING'
      }
    })

    return NextResponse.json(
      {
        success: true,
        returnRequest
      },
      {
        status: 201
      }
    )
  } catch (error) {
    console.error('Return creation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create return'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const shipmentId = searchParams.get('shipmentId')

    const returns = await prisma.returnRequest.findMany({
      where: shipmentId
        ? {
            shipmentId
          }
        : {},
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(returns)
  } catch (error) {
    console.error('Returns fetch error:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch returns'
      },
      {
        status: 500
      }
    )
  }
}