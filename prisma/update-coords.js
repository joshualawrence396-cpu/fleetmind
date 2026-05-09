const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateVehicles() {
  try {
    // Update existing vehicles with real Cape Town coordinates
    const vehicles = [
      { registration: 'CA123456', latitude: -33.9249, longitude: 18.4241, status: 'ON_ROUTE' },
      { registration: 'CA789012', latitude: -33.9229, longitude: 18.3859, status: 'AVAILABLE' },
      { registration: 'CY345678', latitude: -33.9265, longitude: 18.4155, status: 'AVAILABLE' }
    ]
    
    for (const v of vehicles) {
      const updated = await prisma.vehicle.updateMany({
        where: { registration: v.registration },
        data: { 
          latitude: v.latitude, 
          longitude: v.longitude,
          status: v.status
        }
      })
      console.log(`✅ Updated ${v.registration}: ${v.latitude}, ${v.longitude}`)
    }
    
    // Check all vehicles
    const allVehicles = await prisma.vehicle.findMany()
    console.log(`\n📊 All vehicles in database:`)
    allVehicles.forEach(v => {
      console.log(`   ${v.registration}: lat=${v.latitude}, lng=${v.longitude}, status=${v.status}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateVehicles()
