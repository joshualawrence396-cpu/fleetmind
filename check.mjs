import { PrismaClient } from "@prisma/client"
const p = new PrismaClient()
const vehicles = await p.vehicle.findMany({ include: { driver: true } })
const drivers = await p.driver.findMany({ include: { vehicle: true } })
console.log("=== VEHICLES ===")
console.log(JSON.stringify(vehicles, null, 2))
console.log("=== DRIVERS ===")
console.log(JSON.stringify(drivers, null, 2))
await p.$disconnect()