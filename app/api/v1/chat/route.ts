import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create or get chat room
export async function POST(req: NextRequest) {
  try {
    const { driverId, dispatcherId, type } = await req.json()
    
    const room = await prisma.chatRoom.upsert({
      where: {
        driverId_dispatcherId: {
          driverId: driverId,
          dispatcherId: dispatcherId
        }
      },
      update: {},
      create: {
        driverId,
        dispatcherId,
        type: type || 'DRIVER_DISPATCHER',
        status: 'ACTIVE'
      }
    })
    
    return NextResponse.json(room)
  } catch (error) {
    console.error('Chat room error:', error)
    return NextResponse.json({ error: 'Failed to create chat room' }, { status: 500 })
  }
}

// Send message
export async function PUT(req: NextRequest) {
  try {
    const { roomId, senderId, senderType, message } = await req.json()
    
    const chatMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        senderType,
        message,
        isRead: false
      }
    })
    
    // Update room's updatedAt
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { updatedAt: new Date() }
    })
    
    return NextResponse.json(chatMessage)
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// Get messages for a room
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 })
    }
    
    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      take: 100
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}