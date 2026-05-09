import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, type, message, recipient } = await req.json()
    
    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        shipmentId,
        type, // SMS, EMAIL, PUSH
        recipient,
        message,
        status: 'PENDING',
        sentAt: new Date()
      }
    })
    
    // In production, integrate with Twilio/SendGrid here
    console.log(Sending  to : )
    
    // Update notification status
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: 'SENT' }
    })
    
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}

// Get notifications for a shipment
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const shipmentId = searchParams.get('shipmentId')
  
  const notifications = await prisma.notification.findMany({
    where: shipmentId ? { shipmentId } : {},
    orderBy: { sentAt: 'desc' }
  })
  
  return NextResponse.json(notifications)
}
