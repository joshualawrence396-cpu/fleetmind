import { NextRequest, NextResponse } from 'next/server'

// Store subscriptions in memory (use database in production)
const subscriptions = new Map()

export async function POST(req: NextRequest) {
  try {
    const { driverId, subscription, title, body } = await req.json()
    
    // Subscribe endpoint
    if (subscription) {
      subscriptions.set(driverId, subscription)
      return NextResponse.json({ success: true, message: 'Subscribed' })
    }
    
    // Send notification endpoint
    if (title && body) {
      const sub = subscriptions.get(driverId)
      if (sub) {
        // In production, you would use web-push to send actual notifications
        console.log(Sending notification to :  - )
        return NextResponse.json({ success: true, message: 'Notification sent' })
      }
      return NextResponse.json({ error: 'Driver not subscribed' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 })
  }
}
