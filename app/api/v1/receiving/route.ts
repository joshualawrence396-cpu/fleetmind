import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sku, quantity, warehouseCode, reference } = await req.json()
    
    return NextResponse.json({
      success: true,
      message: Received  units of ,
      movement: { sku, quantity, warehouseCode, reference, timestamp: new Date().toISOString() }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to receive stock' }, { status: 500 })
  }
}
