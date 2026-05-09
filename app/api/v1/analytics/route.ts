import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Return mock analytics data
  const mockData = {
    metrics: {
      totalOrders: 15,
      totalShipments: 12,
      totalVehicles: 3,
      activeDrivers: 2,
      totalWarehouses: 1,
      inventoryItems: 3,
      deliveryRate: 92.5
    },
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(mockData)
}
