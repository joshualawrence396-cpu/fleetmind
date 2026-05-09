import { NextRequest, NextResponse } from 'next/server'

// In-memory store (use database in production)
const subscriptions = new Map()

export async function POST(req: NextRequest) {
  try {
    const { driverId, subscription } = await req.json()
    
    if (!driverId || !subscription) {
      return NextResponse.json({ error: 'Driver ID and subscription required' }, { status: 400 })
    }
    
    subscriptions.set(driverId, subscription)
    console.log(Driver  subscribed to push notifications)
    
    return NextResponse.json({ success: true, message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { driverId } = await req.json()
    subscriptions.delete(driverId)
    console.log(Driver  unsubscribed)
    
    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
