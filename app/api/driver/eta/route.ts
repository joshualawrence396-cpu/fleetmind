import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const origin = searchParams.get('origin')
    const destination = searchParams.get('destination')
    
    if (!origin || !destination) {
      return NextResponse.json({ error: 'Origin and destination required' }, { status: 400 })
    }
    
    // In production, call Google Maps Distance Matrix API
    // For now, return mock data
    const mockDuration = 900 + Math.random() * 600 // 15-25 minutes
    
    return NextResponse.json({
      duration: mockDuration,
      distance: mockDuration * 0.5 // Rough estimate in meters
    })
  } catch (error) {
    console.error('ETA calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate ETA' }, { status: 500 })
  }
}
