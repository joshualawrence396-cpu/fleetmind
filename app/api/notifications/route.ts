import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/notifications - Get notifications for current user
export async function GET(request: NextRequest) {
  try {
    // For now, return all notifications (in a real app, filter by user)
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, category, userId, data } = body

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || 'INFO',
        category: category || 'GENERAL',
        userId,
        data
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// PUT /api/notifications/[id]/read - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split('/')
    const id = segments[segments.length - 2] // Get ID from /api/notifications/[id]/read

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}