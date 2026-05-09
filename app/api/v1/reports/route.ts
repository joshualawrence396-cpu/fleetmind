import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'daily'
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    const nextDate = new Date(targetDate)
    nextDate.setDate(nextDate.getDate() + 1)
    
    let report = {}
    
    switch(type) {
      case 'daily':
        const dailyOrders = await prisma.order.count({
          where: {
            createdAt: {
              gte: targetDate,
              lt: nextDate
            }
          }
        })
        
        const dailyDeliveries = await prisma.shipment.count({
          where: {
            status: 'DELIVERED',
            actualDeliveryAt: {
              gte: targetDate,
              lt: nextDate
            }
          }
        })
        
        report = {
          type: 'daily',
          date,
          orders: dailyOrders,
          deliveries: dailyDeliveries,
          deliveryRate: dailyOrders > 0 ? (dailyDeliveries / dailyOrders) * 100 : 0
        }
        break
        
      case 'driver-performance':
        const drivers = await prisma.driver.findMany({
          include: {
            routes: {
              where: {
                date: {
                  gte: targetDate,
                  lt: nextDate
                }
              },
              include: {
                stops: {
                  where: { status: 'COMPLETED' }
                }
              }
            }
          }
        })
        
        report = drivers.map(d => ({
          name: d.fullName,
          totalDeliveries: d.routes.reduce((sum, r) => sum + r.stops.length, 0),
          rating: d.rating || 0,
          status: d.status
        }))
        break
        
      case 'inventory':
        const inventory = await prisma.inventoryHolding.findMany({
          include: {
            item: true,
            node: { include: { warehouse: true } }
          }
        })
        
        report = inventory.map(i => ({
          sku: i.item.sku,
          product: i.item.title,
          quantity: i.quantityOnHand,
          warehouse: i.node.warehouse?.name,
          location: i.bin?.code || 'Unassigned'
        }))
        break
    }
    
    return NextResponse.json(report)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
