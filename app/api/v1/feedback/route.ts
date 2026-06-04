import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const {
      shipmentId,
      rating,
      comment,
      customerName
    } = await req.json()

    const feedback = await prisma.feedback.create({
      data: {
        shipmentId: shipmentId || null,
        rating: Number(rating),
        comment: comment || null,
        customerName: customerName || null
      }
    })

    return NextResponse.json(feedback, {
      status: 201
    })
  } catch (error) {
    console.error('Feedback create error:', error)

    return NextResponse.json(
      {
        error: 'Failed to submit feedback'
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

    const feedback = await prisma.feedback.findMany({
      where: shipmentId
        ? {
            shipmentId
          }
        : {},
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Feedback fetch error:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch feedback'
      },
      {
        status: 500
      }
    )
  }
}