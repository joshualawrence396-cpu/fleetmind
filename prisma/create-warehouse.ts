import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createWarehouse() {
  try {
    const carrier = await prisma.carrier.findFirst()
    if (!carrier) {
      console.error('No carrier found')
      return
    }
    
    const warehouse = await prisma.warehouse.upsert({
      where: { carrierId_code: { carrierId: carrier.id, code: 'MAIN-WH' } },
      update: {},
      create: {
        carrierId: carrier.id,
        code: 'MAIN-WH',
        name: 'Main Warehouse',
        address: { address: '123 Warehouse St', city: 'Cape Town' },
        latitude: -33.9249,
        longitude: 18.4241,
        totalArea: 10000,
        isActive: true
      }
    })
    console.log('✅ Warehouse created/updated:', warehouse.code)
    
    // Create a zone
    const zone = await prisma.warehouseZone.upsert({
      where: { warehouseId_code: { warehouseId: warehouse.id, code: 'STORAGE-A' } },
      update: {},
      create: {
        warehouseId: warehouse.id,
        code: 'STORAGE-A',
        name: 'Storage Zone A',
        type: 'STORAGE',
        isActive: true
      }
    })
    console.log('✅ Zone created:', zone.code)
    
    // Create some bins
    for (let i = 1; i <= 5; i++) {
      const binCode = BIN-
      await prisma.warehouseBin.upsert({
        where: { zoneId_code: { zoneId: zone.id, code: binCode } },
        update: {},
        create: {
          zoneId: zone.id,
          code: binCode,
          type: 'SHELF',
          isActive: true
        }
      })
    }
    console.log('✅ Created 5 bins')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.()
  }
}

createWarehouse()
