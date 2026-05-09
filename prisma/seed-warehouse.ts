import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupWarehouse() {
  try {
    console.log('Setting up warehouse test data...')
    
    const carrier = await prisma.carrier.findFirst()
    if (!carrier) {
      console.error('No carrier found. Run seed first.')
      return
    }
    
    // Create warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { carrierId_code: { carrierId: carrier.id, code: 'CPT-MAIN' } },
      update: {},
      create: {
        carrierId: carrier.id,
        code: 'CPT-MAIN',
        name: 'Cape Town Main Warehouse',
        address: { address: '123 Warehouse Ave', city: 'Cape Town' },
        latitude: -33.9249,
        longitude: 18.4241,
        totalArea: 10000,
        totalVolume: 50000,
        hasColdChain: true,
        isActive: true
      }
    })
    console.log('✅ Warehouse created:', warehouse.name)
    
    // Create zones
    const zones = [
      { code: 'RECV', name: 'Receiving Zone', type: 'RECEIVING' },
      { code: 'STOR-A', name: 'Storage Zone A', type: 'STORAGE' },
      { code: 'STOR-B', name: 'Storage Zone B', type: 'STORAGE' },
      { code: 'PICK', name: 'Picking Zone', type: 'PICKING' },
      { code: 'PACK', name: 'Packing Zone', type: 'PACKING' },
      { code: 'SHIP', name: 'Shipping Zone', type: 'SHIPPING' }
    ]
    
    for (const zoneData of zones) {
      const zone = await prisma.warehouseZone.upsert({
        where: { warehouseId_code: { warehouseId: warehouse.id, code: zoneData.code } },
        update: {},
        create: {
          warehouseId: warehouse.id,
          code: zoneData.code,
          name: zoneData.name,
          type: zoneData.type,
          isActive: true
        }
      })
      console.log('  Zone created:', zone.name)
      
      // Create bins for storage zones
      if (zoneData.type === 'STORAGE') {
        for (let i = 1; i <= 5; i++) {
          const binCode = zoneData.code + '-' + i
          await prisma.warehouseBin.upsert({
            where: { zoneId_code: { zoneId: zone.id, code: binCode } },
            update: {},
            create: {
              zoneId: zone.id,
              code: binCode,
              type: 'SHELF',
              capacity: { weightKg: 500, volumeM3: 2 },
              isActive: true
            }
          })
        }
        console.log('    Created 5 bins for', zone.name)
      }
    }
    
    console.log('')
    console.log('✅ Warehouse setup complete!')
    console.log('')
    console.log('📋 Test Data:')
    console.log('  Warehouse ID:', warehouse.id)
    console.log('  Warehouse Code:', warehouse.code)
    console.log('  Zones:', zones.length)
    console.log('  Bins: 10+')
    
  } catch (error) {
    console.error('Error setting up warehouse:', error)
  } finally {
    await prisma.()
  }
}

setupWarehouse()