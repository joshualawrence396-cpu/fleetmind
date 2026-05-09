import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const [vehicles, drivers, orders, inventory] = await Promise.all([
      prisma.vehicle.findMany(),
      prisma.driver.findMany(),
      prisma.order.findMany(),
      prisma.inventoryItem.findMany()
    ])
    const completedOrders = orders.filter(o => o.status === "COMPLETED").length
    const pendingOrders = orders.filter(o => o.status === "PENDING").length
    const inProgressOrders = orders.filter(o => o.status === "IN_PROGRESS").length
    const activeVehicles = vehicles.filter(v => v.status === "ON_ROUTE").length
    const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE").length
    const maintenanceVehicles = vehicles.filter(v => v.status === "MAINTENANCE").length
    const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
    const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length
    return NextResponse.json({
      totalRevenue: completedOrders * 1500,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeDrivers: drivers.filter(d => d.status === "ACTIVE").length,
      totalDrivers: drivers.length,
      totalVehicles: vehicles.length,
      totalOrders: orders.length,
      totalInventoryValue,
      lowStockItems,
      completionRate: orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}