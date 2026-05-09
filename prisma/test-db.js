const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    // Try to query the database
    const userCount = await prisma.user.count()
    console.log(`✅ Connected to Neon Database!`)
    console.log(`   Users in database: ${userCount}`)
    
    // Show some sample data
    const users = await prisma.user.findMany()
    console.log(`\n📊 Database Statistics:`)
    console.log(`   - Users: ${users.length}`)
    
    const vehicles = await prisma.vehicle.count()
    console.log(`   - Vehicles: ${vehicles}`)
    
    const drivers = await prisma.driver.count()
    console.log(`   - Drivers: ${drivers}`)
    
    const orders = await prisma.order.count()
    console.log(`   - Orders: ${orders}`)
    
    const warehouses = await prisma.warehouse.count()
    console.log(`   - Warehouses: ${warehouses}`)
    
    const inventory = await prisma.inventoryItem.count()
    console.log(`   - Inventory Items: ${inventory}`)
    
    console.log(`\n🎉 Your Neon PostgreSQL database is working perfectly!`)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
