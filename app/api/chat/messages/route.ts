import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mock current user - in real app, get from auth
const CURRENT_USER_ID = 'admin-user'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get messages between current user and selected user
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { fromId: CURRENT_USER_ID, toId: userId },
          { fromId: userId, toId: CURRENT_USER_ID }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        from: {
          select: { name: true }
        },
        to: {
          select: { name: true }
        }
      }
    })

    // Transform for frontend
    const transformedMessages = messages.map(msg => ({
      id: msg.id,
      from: msg.fromId === CURRENT_USER_ID ? 'current-user' : msg.from.name,
      to: msg.toId === CURRENT_USER_ID ? 'current-user' : msg.to.name,
      message: msg.message,
      timestamp: msg.createdAt.toISOString(),
      read: msg.read
    }))

    return NextResponse.json(transformedMessages)

  } catch (error) {
    console.error('Chat messages error:', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ error: 'Recipient and message required' }, { status: 400 })
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        fromId: CURRENT_USER_ID,
        toId: to,
        message,
        read: false
      },
      include: {
        from: {
          select: { name: true }
        },
        to: {
          select: { name: true }
        }
      }
    })

    // Transform for frontend
    const transformedMessage = {
      id: newMessage.id,
      from: 'current-user',
      to: newMessage.to.name,
      message: newMessage.message,
      timestamp: newMessage.createdAt.toISOString(),
      read: newMessage.read
    }

    return NextResponse.json(transformedMessage)

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}