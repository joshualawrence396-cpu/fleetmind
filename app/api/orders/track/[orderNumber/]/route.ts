import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const orderNumber = params.orderNumber

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        driver: true,
        vehicle: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Return order details (excluding sensitive information)
    const orderDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      pickupAddress: order.pickupAddress,
      status: order.status,
      priority: order.priority,
      driverName: order.driver?.name || null,
      vehicleRegistration: order.vehicle?.registration || null,
      scheduledDate: order.scheduledDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }

    return NextResponse.json(orderDetails)
  } catch (error) {
    console.error('Order tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}