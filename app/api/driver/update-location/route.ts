import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { driverId, location, timestamp } = await req.json()

    // Store location in database or cache
    console.log(
      `Driver ${driverId} at ${JSON.stringify(location)} at ${timestamp}`
    )

    // You can store this in Redis or a separate table for real-time tracking
    // For now, we'll just log it

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Location update error:', error)

    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    )
  }
}