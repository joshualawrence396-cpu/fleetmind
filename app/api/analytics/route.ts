import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { cacheGet, cacheSet } from "../../../lib/redis"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cacheKey = "analytics:main"
    const cached = await cacheGet(cacheKey)
    if (cached) return NextResponse.json(typeof cached === "string" ? JSON.parse(cached) : cached)

    const [vehicles, drivers, orders, inventory, fuel, maintenance] = await Promise.all([
      prisma.vehicle.findMany(),
      prisma.driver.findMany(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.inventoryItem.findMany(),
      prisma.fuelEntry.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.maintenanceRecord.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    ])

    const completedOrders = orders.filter(o => o.status === "COMPLETED")
    const today = new Date().toISOString().split("T")[0]
    const todayOrders = orders.filter(o => o.createdAt.toISOString().split("T")[0] === today)

    const data = {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === "ON_ROUTE").length,
      availableVehicles: vehicles.filter(v => v.status === "AVAILABLE").length,
      maintenanceVehicles: vehicles.filter(v => v.status === "MAINTENANCE").length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === "ACTIVE").length,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter(o => o.status === "PENDING").length,
      inProgressOrders: orders.filter(o => o.status === "IN_PROGRESS").length,
      failedOrders: orders.filter(o => o.status === "FAILED").length,
      todayOrders: todayOrders.length,
      completionRate: orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0,
      estimatedRevenue: completedOrders.length * 1500,
      totalFuelCost: fuel.reduce((s, f) => s + (f.totalCost || 0), 0),
      totalFuelLitres: fuel.reduce((s, f) => s + (f.litres || 0), 0),
      totalMaintenanceCost: maintenance.reduce((s, m) => s + (m.cost || 0), 0),
      totalInventoryValue: inventory.reduce((s, i) => s + ((i.quantity || 0) * (i.unitPrice || 0)), 0),
      totalInventoryItems: inventory.length,
      lowStockItems: inventory.filter(i => i.quantity <= (i.minStock || 0)).length,
      generatedAt: new Date().toISOString(),
    }

    await cacheSet(cacheKey, data, 300)
    return NextResponse.json(data)
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}