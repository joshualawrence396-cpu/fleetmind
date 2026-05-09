import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id

    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { read: true }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Mark as read error:', error)
    return NextResponse.json({ error: 'Failed to mark message as read' }, { status: 500 })
  }
}