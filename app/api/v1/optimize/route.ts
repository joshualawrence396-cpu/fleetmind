import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RouteOptimizer } from '@/lib/routing/optimizer'

export async function POST(req: NextRequest) {
  try {
    const { hubId } = await req.json()

    // Use Orders instead of Shipments
    const orders = await prisma.order.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (orders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No orders available'
      })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE'
      }
    })

    if (vehicles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No vehicles available'
      })
    }

    const depot = {
      id: 'DEPOT',
      lat: -33.9249,
      lng: 18.4241,
      demand: 0
    }

    const locations = [
      depot,
      ...orders.map((order, index) => ({
        id: order.id,
        lat: -33.9249,
        lng: 18.4241,
        demand: 1 + (index % 3)
      }))
    ]

    const routingVehicles = vehicles.map(vehicle => ({
      id: vehicle.id,
      capacity: 100
    }))

    const optimization = RouteOptimizer.optimize(
      locations,
      routingVehicles,
      depot
    )

    return NextResponse.json({
      success: true,
      hubId,
      totalOrders: orders.length,
      totalVehicles: vehicles.length,
      optimization
    })
  } catch (error) {
    console.error('Optimization error:', error)

    return NextResponse.json(
      {
        error: 'Failed to optimize routes',
        details:
          error instanceof Error
            ? error.message
            : String(error)
      },
      {
        status: 500
      }
    )
  }
}