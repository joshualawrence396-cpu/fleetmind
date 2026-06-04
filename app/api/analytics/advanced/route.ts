import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get orders data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        driver: true,
        vehicle: true
      }
    })

    // Calculate metrics
    const totalOrders = orders.length
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length
    const inProgressOrders = orders.filter(o => ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(o.status)).length
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length

    // Calculate revenue (assuming each order has a value)
   const totalRevenue = orders
  .filter(o => o.status === 'DELIVERED')
  .reduce((sum, order) => sum + (order.declaredValue || 0), 0)

    // Fleet utilization
    const activeVehicles = await prisma.vehicle.count({
      where: {
        status: 'ACTIVE'
      }
    })
    const totalVehicles = await prisma.vehicle.count()
    const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0

    // Average delivery time (mock calculation)
    const deliveredOrders = orders.filter(
  o => o.status === 'DELIVERED' && o.completedAt
)
    const avgDeliveryTime = deliveredOrders.length > 0
      ? deliveredOrders.reduce((sum, order) => {
          const deliveryTime = (new Date(order.completedAt!).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60)
          return sum + deliveryTime
        }, 0) / deliveredOrders.length
      : 0

    // Driver performance
    const drivers = await prisma.driver.findMany({
      include: {
        orders: {
          where: {
            createdAt: {
              gte: startDate
            },
            status: 'DELIVERED'
          }
        }
      }
    })

    const driverStats = drivers.map(driver => ({
      name: driver.name,
      completedOrders: driver.orders.length,
      rating: driver.rating || 0
    }))

    const topDriver = driverStats.sort((a, b) => b.completedOrders - a.completedOrders)[0]?.name || 'N/A'
    const avgDriverRating = driverStats.length > 0
      ? driverStats.reduce((sum, d) => sum + d.rating, 0) / driverStats.length
      : 0

    // Fuel and maintenance data
    const fuelLogs = await prisma.fuelEntry.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

  const avgFuelEconomy = fuelLogs.length > 0
  ? fuelLogs.reduce((sum, log) => sum + log.litres, 0) / fuelLogs.length
  : 0

    const maintenanceCost = maintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0)

    // Mock additional metrics
    const onTimeRate = 95
    const vehicleDowntime = 24
    const customerSatisfaction = 4.2
    const repeatOrderRate = 68
    const complaintCount = 3

    return NextResponse.json({
      totalRevenue,
      completedOrders,
      inProgressOrders,
      pendingOrders,
      totalOrders,
      fleetUtilization,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      topDriver,
      avgDriverRating: Math.round(avgDriverRating * 10) / 10,
      avgFuelEconomy: Math.round(avgFuelEconomy * 10) / 10,
      maintenanceCost,
      onTimeRate,
      vehicleDowntime,
      customerSatisfaction,
      repeatOrderRate,
      complaintCount
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}