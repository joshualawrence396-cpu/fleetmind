import { PrismaClient } from "@prisma/client"
const p = new PrismaClient()

const vehicleId = "cmoxmy4qu0000w8ywal9pe7me"
const driverId = "cmoxmjj480000w8r87zwrws14"

await p.vehicle.update({
  where: { id: vehicleId },
  data: { driverId: driverId, status: "ON_ROUTE" }
})

console.log("✅ Vehicle assigned to josh!")
const v = await p.vehicle.findMany({ include: { driver: true } })
console.log(JSON.stringify(v, null, 2))
await p.$disconnect()