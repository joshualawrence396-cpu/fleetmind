import { initTRPC, TRPCError } from "@trpc/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { PrismaClient } from "@prisma/client"
import superjson from "superjson"
import { z } from "zod"

const prisma = new PrismaClient()

export const createContext = async (opts?: any) => {
  const session = await getServerSession(authOptions).catch(() => null)
  return { session, prisma, user: session?.user as any }
}

const t = initTRPC.context<typeof createContext>().create({ transformer: superjson })

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" })
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)

// Fleet router
const fleetRouter = router({
  getVehicles: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.vehicle.findMany({ include: { driver: true }, orderBy: { createdAt: "desc" } })
  }),
  getDrivers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.driver.findMany({ include: { vehicle: true }, orderBy: { createdAt: "desc" } })
  }),
  getOrders: protectedProcedure
    .input(z.object({ status: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: input.status ? { status: input.status } : undefined,
        include: { driver: true, vehicle: true },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      })
    }),
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const [vehicles, drivers, orders, inventory, fuel] = await Promise.all([
      ctx.prisma.vehicle.findMany(),
      ctx.prisma.driver.findMany(),
      ctx.prisma.order.findMany(),
      ctx.prisma.inventoryItem.findMany(),
      ctx.prisma.fuelEntry.findMany(),
    ])
    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === "ON_ROUTE").length,
      availableVehicles: vehicles.filter(v => v.status === "AVAILABLE").length,
      totalDrivers: drivers.length,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === "COMPLETED").length,
      pendingOrders: orders.filter(o => o.status === "PENDING").length,
      totalRevenue: orders.filter(o => o.status === "COMPLETED").length * 1500,
      completionRate: orders.length > 0 ? Math.round((orders.filter(o => o.status === "COMPLETED").length / orders.length) * 100) : 0,
      totalFuelCost: fuel.reduce((s, f) => s + f.totalCost, 0),
      totalInventoryValue: inventory.reduce((s, i) => s + (i.quantity * i.unitPrice), 0),
      lowStockItems: inventory.filter(i => i.quantity <= i.minStock).length,
    }
  }),
  createOrder: protectedProcedure
    .input(z.object({
      customerName: z.string(),
      customerEmail: z.string().email(),
      customerPhone: z.string(),
      deliveryAddress: z.string(),
      pickupAddress: z.string(),
      priority: z.string().default("NORMAL"),
      driverId: z.string().optional(),
      vehicleId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.create({
        data: { ...input, orderNumber: "ORD-" + Date.now(), status: "PENDING" },
        include: { driver: true, vehicle: true },
      })
    }),
  updateOrderStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.update({
        where: { id: input.id },
        data: { status: input.status, completedAt: input.status === "COMPLETED" ? new Date() : undefined },
      })
    }),
})

// Geofencing router
const geoRouter = router({
  getGeofences: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.geofence.findMany().catch(() => [])
  }),
  checkVehicleInGeofence: protectedProcedure
    .input(z.object({ vehicleId: z.string(), lat: z.number(), lng: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const geofences = await ctx.prisma.geofence.findMany().catch(() => [])
      const triggered = geofences.filter((g: any) => {
        const dist = Math.sqrt(Math.pow(g.centerLat - input.lat, 2) + Math.pow(g.centerLng - input.lng, 2)) * 111
        return dist <= g.radiusKm
      })
      return { triggered, count: triggered.length }
    }),
})

export const appRouter = router({
  fleet: fleetRouter,
  geo: geoRouter,
})

export type AppRouter = typeof appRouter