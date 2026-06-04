import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { type, message, recipient } = await req.json()

    const notification = await prisma.notification.create({
      data: {
        type,
        recipient,
        message
      }
    })

    console.log(
      `Sending ${type} to ${recipient}: ${message}`
    )

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Notification error:', error)

    return NextResponse.json(
      {
        error: 'Failed to send notification'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET() {
  try {
    const notifications =
      await prisma.notification.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(
      'Fetch notifications error:',
      error
    )

    return NextResponse.json(
      {
        error: 'Failed to fetch notifications'
      },
      {
        status: 500
      }
    )
  }
}