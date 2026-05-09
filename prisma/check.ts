import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
  const vehicles = await prisma.vehicle.findMany()
  console.log('Vehicles in database:', vehicles.length)
  for (const v of vehicles) {
    console.log('  -', v.registration, v.make, v.model)
  }
  
  const carriers = await prisma.carrier.findMany()
  console.log('Carriers:', carriers.length)
  
  const drivers = await prisma.driver.findMany()
  console.log('Drivers:', drivers.length)
  
  const warehouses = await prisma.warehouse.findMany()
  console.log('Warehouses:', warehouses.length)
  
  const inventory = await prisma.inventoryItem.findMany()
  console.log('Inventory items:', inventory.length)
  
  await prisma.()
}

check()