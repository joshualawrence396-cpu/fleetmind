import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const carrier = await prisma.carrier.findFirst()
    if (!carrier) {
      console.error('? No carrier found. Please run: npx prisma db seed')
      return
    }
    
    console.log('Found carrier:', carrier.name)
    
    // Create warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { carrierId_code: { carrierId: carrier.id, code: 'MAIN-WH' } },
      update: {},
      create: {
        carrierId: carrier.id,
        code: 'MAIN-WH',
        name: 'Main Warehouse',
        address: { address: '123 Warehouse St', city: 'Cape Town', country: 'ZA' },
        latitude: -33.9249,
        longitude: 18.4241,
        totalArea: 10000,
        totalVolume: 50000,
        isActive: true
      }
    })
    console.log('? Warehouse created/updated:', warehouse.code, '-', warehouse.name)
    
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
    console.log('? Zone created:', zone.code)
    
    // Create bins
    for (let i = 1; i <= 5; i++) {
      const bin = await prisma.warehouseBin.upsert({
        where: { zoneId_code: { zoneId: zone.id, code: BIN-${code} } },
        update: {},
        create: {
          zoneId: zone.id,
          code: BIN-,
          type: 'SHELF',
          capacity: { weightKg: 500, volumeM3: 2 },
          isActive: true
        }
      })
      console.log(  ? Bin created: )
    }
    
    console.log('\n?? Warehouse setup complete!')
    console.log('Warehouse Code: MAIN-WH')
    console.log('Zone: STORAGE-A')
    console.log('Bins: BIN-1 through BIN-5')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.()
  }
}

main()

