import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30d'

    const days =
      period === '7d'
        ? 7
        : period === '90d'
        ? 90
        : 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get comprehensive metrics
    const [orders, vehicles, drivers, warehouses, inventory] =
      await Promise.all([
        prisma.order.count(),
        prisma.vehicle.count(),
        prisma.driver.count(),
        prisma.warehouse.count(),
        prisma.inventoryItem.count()
      ])

    // Calculate trends
    const previousStart = new Date(startDate)
    previousStart.setDate(previousStart.getDate() - days)

    const previousOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: previousStart,
          lt: startDate
        }
      }
    })

    const orderGrowth =
      previousOrders > 0
        ? ((orders - previousOrders) / previousOrders) * 100
        : 0

    // Daily stats
    const allOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        status: true
      }
    })

    const dailyMap = new Map<
      string,
      { orders: number; delivered: number }
    >()

    allOrders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0]

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          orders: 0,
          delivered: 0
        })
      }

      const stats = dailyMap.get(date)!

      stats.orders++

      if (order.status === 'DELIVERED') {
        stats.delivered++
      }
    })

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        orders: stats.orders,
        delivered: stats.delivered
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30)

    // AI Insights
    const insights = []

    if (orderGrowth > 20) {
      insights.push({
        type: 'POSITIVE',
        message:
          'Order volume has grown by ' +
          orderGrowth.toFixed(1) +
          '% compared to previous period',
        recommendation:
          'Consider adding more vehicles to handle increased demand'
      })
    } else if (orderGrowth < -20) {
      insights.push({
        type: 'NEGATIVE',
        message:
          'Order volume decreased by ' +
          Math.abs(orderGrowth).toFixed(1) +
          '%',
        recommendation:
          'Review marketing and customer engagement strategies'
      })
    }

    if (vehicles > 0 && drivers === 0) {
      insights.push({
        type: 'WARNING',
        message:
          'Vehicles available but no active drivers',
        recommendation:
          'Schedule drivers for the upcoming shifts'
      })
    }

    if (inventory < 10) {
      insights.push({
        type: 'WARNING',
        message:
          'Low inventory variety - only ' +
          inventory +
          ' products available',
        recommendation:
          'Add more products to improve service offering'
      })
    }

    if (dailyStats.length > 0) {
      const avgDailyOrders =
        dailyStats.reduce(
          (sum, d) => sum + d.orders,
          0
        ) / dailyStats.length

      insights.push({
        type: 'INFO',
        message:
          'Average daily orders: ' +
          avgDailyOrders.toFixed(1),
        recommendation:
          'Use this data for workforce planning'
      })
    }

    return NextResponse.json({
      success: true,
      period,
      metrics: {
        totalOrders: orders,
        totalVehicles: vehicles,
        activeDrivers: drivers,
        totalWarehouses: warehouses,
        inventoryItems: inventory,
        orderGrowth: orderGrowth.toFixed(1)
      },
      dailyStats,
      insights,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Analytics error:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
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