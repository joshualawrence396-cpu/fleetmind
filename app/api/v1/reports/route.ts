import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const type =
      searchParams.get('type') || 'daily'

    const date =
      searchParams.get('date') ||
      new Date().toISOString().split('T')[0]

    const targetDate = new Date(date)

    targetDate.setHours(0, 0, 0, 0)

    const nextDate = new Date(targetDate)

    nextDate.setDate(nextDate.getDate() + 1)

    let report: any = {}

    switch (type) {
      case 'daily': {
        const dailyOrders =
          await prisma.order.count({
            where: {
              createdAt: {
                gte: targetDate,
                lt: nextDate
              }
            }
          })

        report = {
          type: 'daily',
          date,
          orders: dailyOrders,
          deliveries: dailyOrders,
          deliveryRate:
            dailyOrders > 0 ? 100 : 0
        }

        break
      }

      case 'driver-performance': {
        const drivers =
          await prisma.driver.findMany()

        report = drivers.map((d) => ({
          driverId: d.id,
          name: d.name,
          rating: d.rating ?? 0,
          status: d.status,
          totalDeliveries:
            d.totalDeliveries ?? 0
        }))

        break
      }

      case 'inventory': {
        try {
          const inventory =
            await prisma.inventoryItem.findMany()

          report = inventory.map((item) => ({
            id: item.id,
            sku: item.sku,
            quantity: item.quantity ?? 0,
            weight: item.weight ?? 0,
            warehouseId: item.warehouseId
          }))
        } catch (error) {
          console.error(
            'Inventory report error:',
            error
          )

          report = []
        }

        break
      }

      default: {
        report = {
          error: 'Unknown report type'
        }
      }
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error(
      'Report generation error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate report'
      },
      {
        status: 500
      }
    )
  }
}