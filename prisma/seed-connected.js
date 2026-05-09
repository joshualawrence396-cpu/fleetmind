const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear all data
  await prisma.order.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.warehouse.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.user.deleteMany()
  
  // Create Admin User
  await prisma.user.create({
    data: {
      email: 'admin@fleetmind.com',
      name: 'Administrator',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin'
    }
  })
  
  // Create Vehicles first
  const vehicles = [
    { registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'ON_ROUTE', latitude: -33.9249, longitude: 18.4241 },
    { registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE', latitude: -33.9229, longitude: 18.3859 },
    { registration: 'CY345678', make: 'Nissan', model: 'NP200', status: 'AVAILABLE', latitude: -33.9265, longitude: 18.4155 }
  ]
  
  const createdVehicles = []
  for (const v of vehicles) {
    const created = await prisma.vehicle.create({ data: v })
    createdVehicles.push(created)
    console.log(`✅ Vehicle: ${v.registration} at (${v.latitude}, ${v.longitude})`)
  }
  
  // Create Drivers linked to Vehicles
  const drivers = [
    { name: 'John Doe', email: 'john@fleetmind.com', phone: '+1234567890', status: 'ACTIVE', vehicleId: createdVehicles[0].id },
    { name: 'Jane Smith', email: 'jane@fleetmind.com', phone: '+1234567891', status: 'ACTIVE', vehicleId: createdVehicles[1].id },
    { name: 'Mike Johnson', email: 'mike@fleetmind.com', phone: '+1234567892', status: 'ACTIVE' }
  ]
  
  for (const d of drivers) {
    const created = await prisma.driver.create({ data: d })
    console.log(`✅ Driver: ${created.name} ${d.vehicleId ? '→ Vehicle assigned' : ''}`)
  }
  
  // Create Warehouses
  const warehouses = [
    { name: 'Main Warehouse', location: 'Cape Town', address: '123 Industrial Rd', capacity: 1000, currentStock: 450 },
    { name: 'North Hub', location: 'Durban', address: '456 Commerce Ave', capacity: 800, currentStock: 320 }
  ]
  
  for (const w of warehouses) {
    await prisma.warehouse.create({ data: w })
    console.log(`✅ Warehouse: ${w.name}`)
  }
  
  // Create Orders
  const orders = [
    { orderNumber: 'ORD-001', customerName: 'ABC Corp', customerEmail: 'abc@example.com', customerPhone: '+1234567890', deliveryAddress: '123 Main St', pickupAddress: 'Main Warehouse', status: 'COMPLETED', priority: 'NORMAL' },
    { orderNumber: 'ORD-002', customerName: 'XYZ Ltd', customerEmail: 'xyz@example.com', customerPhone: '+1234567891', deliveryAddress: '456 Oak Ave', pickupAddress: 'North Hub', status: 'IN_PROGRESS', priority: 'HIGH' }
  ]
  
  for (const o of orders) {
    await prisma.order.create({ data: o })
    console.log(`✅ Order: ${o.orderNumber}`)
  }
  
  console.log('\n🎉 Database seeded with connected data!')
  console.log(`📊 Summary:`)
  console.log(`   - Drivers: ${drivers.length} (${drivers.filter(d => d.vehicleId).length} assigned to vehicles)`)
  console.log(`   - Vehicles: ${vehicles.length} (all with GPS coordinates)`)
  console.log(`   - Orders: ${orders.length}`)
  console.log(`   - Warehouses: ${warehouses.length}`)
}

main()