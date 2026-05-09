import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { warehouseId, location, expectedCount, actualCount } = await req.json()
    
    const variance = actualCount - expectedCount
    const status = variance === 0 ? 'MATCH' : variance > 0 ? 'SURPLUS' : 'SHORTAGE'
    
    return NextResponse.json({
      success: true,
      message: Stock count completed for ,
      variance: variance,
      status: status,
      timestamp: new Date().toISOString()
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process stock count' }, { status: 500 })
  }
}
