import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const [vehicles, drivers, orders, inventory, fuel, maintenance] = await Promise.all([
      prisma.vehicle.findMany(),
      prisma.driver.findMany(),
      prisma.order.findMany(),
      prisma.inventoryItem.findMany(),
      prisma.fuelEntry.findMany(),
      prisma.maintenanceRecord.findMany()
    ])
    const completedOrders = orders.filter(o => o.status === "COMPLETED").length
    const pendingOrders = orders.filter(o => o.status === "PENDING").length
    const inProgressOrders = orders.filter(o => o.status === "IN_PROGRESS").length
    const activeVehicles = vehicles.filter(v => v.status === "ON_ROUTE").length
    const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE").length
    const maintenanceVehicles = vehicles.filter(v => v.status === "MAINTENANCE").length
    const totalFuelCost = fuel.reduce((s, f) => s + f.totalCost, 0)
    const totalFuelLitres = fuel.reduce((s, f) => s + f.litres, 0)
    const totalRevenue = completedOrders * 1500
    const totalInventoryValue = inventory.reduce((s, i) => s + (i.quantity * i.unitPrice), 0)
    const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length
    const scheduledMaintenance = maintenance.filter(m => m.status === "SCHEDULED").length
    const avgDriverRating = drivers.filter(d => d.rating).reduce((s, d) => s + (d.rating || 0), 0) / (drivers.filter(d => d.rating).length || 1)

    return NextResponse.json({
      totalRevenue, completedOrders, pendingOrders, inProgressOrders,
      activeVehicles, availableVehicles, maintenanceVehicles,
      activeDrivers: drivers.filter(d => d.status === "ACTIVE").length,
      totalDrivers: drivers.length, totalVehicles: vehicles.length,
      totalOrders: orders.length, totalInventoryValue, lowStockItems,
      totalFuelCost, totalFuelLitres, scheduledMaintenance,
      avgDriverRating: Math.round(avgDriverRating * 10) / 10,
      completionRate: orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0,
      netProfit: totalRevenue - totalFuelCost,
      profitMargin: totalRevenue > 0 ? Math.round(((totalRevenue - totalFuelCost) / totalRevenue) * 100) : 0
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}