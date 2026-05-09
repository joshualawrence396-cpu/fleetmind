import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RouteOptimizer } from '@/lib/routing/optimizer'

export async function POST(req: NextRequest) {
  try {
    const { routeDate, hubId } = await req.json()
    
    const targetDate = routeDate ? new Date(routeDate) : new Date()
    targetDate.setHours(0, 0, 0, 0)
    
    // Get shipments ready for routing
    const shipments = await prisma.shipment.findMany({
      where: {
        status: 'AT_ORIGIN',
        estimatedDeliveryAt: {
          gte: targetDate,
          lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        order: true
      }
    })
    
    if (shipments.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No shipments to optimize' 
      })
    }
    
    // Get hub location
    const hub = await prisma.hub.findUnique({
      where: { id: hubId }
    })
    
    if (!hub) {
      return NextResponse.json({ error: 'Hub not found' }, { status: 404 })
    }
    
    // Get available vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE',
        hubId: hubId
      }
    })
    
    if (vehicles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No vehicles available' 
      })
    }
    
    // Prepare locations for routing
    const locations = [
      {
        id: hub.id,
        lat: hub.latitude,
        lng: hub.longitude,
        demand: 0
      },
      ...shipments.map(shipment => ({
        id: shipment.id,
        lat: (shipment.order.destination as any).latitude || -33.9249,
        lng: (shipment.order.destination as any).longitude || 18.4241,
        demand: shipment.parcelCount || 1
      }))
    ]
    
    // Prepare vehicles for routing
    const routingVehicles = vehicles.map(vehicle => ({
      id: vehicle.id,
      capacity: vehicle.capacityParcels || 100
    }))
    
    // Call the Node.js optimizer
    const optimization = RouteOptimizer.optimize(
      locations,
      routingVehicles,
      { id: hub.id, lat: hub.latitude, lng: hub.longitude, demand: 0 }
    )
    
    if (!optimization.success) {
      return NextResponse.json({ 
        success: false, 
        message: 'Optimization failed', 
        unrouted: optimization.unrouted 
      })
    }
    
    // Create routes in database
    const routes = []
    for (const route of optimization.routes) {
      const dbRoute = await prisma.route.create({
        data: {
          carrierId: hub.carrierId,
          hubId: hub.id,
          vehicleId: route.vehicleId,
          date: targetDate,
          status: 'OPTIMIZED',
          totalDistanceKm: route.totalDistance,
          stops: {
            create: route.stopIds.map((stopId, idx) => ({
              sequence: idx,
              shipmentId: stopId,
              type: 'DELIVERY',
              address: {},
              latitude: 0,
              longitude: 0,
              status: 'PENDING'
            }))
          }
        },
        include: {
          stops: true
        }
      })
      routes.push(dbRoute)
    }
    
    // Save optimization run record
    await prisma.optimizationRun.create({
      data: {
        carrierId: hub.carrierId,
        hubId: hub.id,
        date: targetDate,
        inputPayload: { shipments: shipments.length, vehicles: vehicles.length },
        outputPayload: optimization,
        solver: 'node-tsp',
        status: 'COMPLETED',
        shipmentsRouted: optimization.totalRouted,
        shipmentsUnrouted: optimization.unrouted.length,
        totalDistanceKm: optimization.totalDistance
      }
    })
    
    return NextResponse.json({
      success: true,
      routes: routes,
      totalDistance: optimization.totalDistance,
      totalVehicles: optimization.routes.length,
      shipmentsRouted: optimization.totalRouted,
      shipmentsUnrouted: optimization.unrouted.length
    })
    
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json({ 
      error: 'Failed to optimize routes',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
