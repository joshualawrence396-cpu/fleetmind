import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get chat messages for a room
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const messages = await prisma.chatMessage.findMany({
      where: { roomId: roomId || undefined },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    return NextResponse.json(messages.reverse())
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// Send a message
export async function POST(req: NextRequest) {
  try {
    const { roomId, senderId, message, type } = await req.json()
    
    const chatMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        message,
        type: type || 'TEXT',
        isRead: false
      },
      include: { sender: true }
    })
    
    // Update room's last message
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessage: message, updatedAt: new Date() }
    })
    
    return NextResponse.json(chatMessage, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
