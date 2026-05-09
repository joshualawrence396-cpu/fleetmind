import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
  console.log('Checking available models...')
  
  // Check what models exist
  const models = ['order', 'shipment', 'driver', 'vehicle', 'warehouse', 'inventoryItem']
  
  for (const model of models) {
    try {
      const count = await prisma[model].count()
      console.log(  :  records)
    } catch (e) {
      console.log(  : model not found or error)
    }
  }
  
  await prisma.()
}

check()