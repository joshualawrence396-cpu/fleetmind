const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.order.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.warehouse.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('Cleared existing data')
  
  // Create Users
  const users = [
    { email: 'admin@fleetmind.com', name: 'Admin User', password: 'admin123', role: 'admin' },
    { email: 'driver@fleetmind.com', name: 'Driver User', password: 'driver123', role: 'driver' },
    { email: 'user@fleetmind.com', name: 'Regular User', password: 'user123', role: 'user' }
  ]
  
  for (const user of users) {
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: bcrypt.hashSync(user.password, 10),
        role: user.role
      }
    })
    console.log(`✅ User created: ${user.email}`)
  }
  
  // Create Drivers
  const drivers = [
    { name: 'John Doe', email: 'john@fleetmind.com', phone: '+1234567890', status: 'ACTIVE' },
    { name: 'Jane Smith', email: 'jane@fleetmind.com', phone: '+1234567891', status: 'ACTIVE' },
    { name: 'Mike Johnson', email: 'mike@fleetmind.com', phone: '+1234567892', status: 'ACTIVE' }
  ]
  
  const createdDrivers = []
  for (const driver of drivers) {
    const created = await prisma.driver.create({ data: driver })
    createdDrivers.push(created)
    console.log(`✅ Driver created: ${driver.name}`)
  }
  
  // Create Vehicles
  const vehicles = [
    { registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'ON_ROUTE', latitude: -33.9249, longitude: 18.4241, driverId: createdDrivers[0].id },
    { registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE', latitude: -33.9229, longitude: 18.3859 },
    { registration: 'CY345678', make: 'Nissan', model: 'NP200', status: 'AVAILABLE', latitude: -33.9300, longitude: 18.4100 }
  ]
  
  const createdVehicles = []
  for (const vehicle of vehicles) {
    const created = await prisma.vehicle.create({ data: vehicle })
    createdVehicles.push(created)
    console.log(`✅ Vehicle created: ${vehicle.registration}`)
  }
  
  // Create Warehouses
  const warehouses = [
    { name: 'Main Warehouse', location: 'Cape Town', address: '123 Industrial Rd, Cape Town', latitude: -33.9249, longitude: 18.4241, capacity: 1000, currentStock: 450, manager: 'John Smith', phone: '+1234567890' },
    { name: 'North Distribution Center', location: 'Durban', address: '456 Commerce Ave, Durban', latitude: -29.8587, longitude: 31.0218, capacity: 800, currentStock: 320, manager: 'Sarah Johnson', phone: '+1234567891' },
    { name: 'South Logistics Hub', location: 'Johannesburg', address: '789 Trade St, Johannesburg', latitude: -26.2041, longitude: 28.0473, capacity: 1200, currentStock: 890, manager: 'Peter Williams', phone: '+1234567892' }
  ]
  
  const createdWarehouses = []
  for (const warehouse of warehouses) {
    const created = await prisma.warehouse.create({ data: warehouse })
    createdWarehouses.push(created)
    console.log(`✅ Warehouse created: ${warehouse.name}`)
  }
  
  // Create Inventory Items
  const inventory = [
    { name: 'Laptop', sku: 'LAP-001', category: 'Electronics', quantity: 150, unitPrice: 999.99, warehouseId: createdWarehouses[0].id, minStock: 50, maxStock: 500 },
    { name: 'Smartphone', sku: 'PHN-001', category: 'Electronics', quantity: 300, unitPrice: 699.99, warehouseId: createdWarehouses[0].id, minStock: 100, maxStock: 1000 },
    { name: 'Monitor', sku: 'MON-001', category: 'Electronics', quantity: 80, unitPrice: 299.99, warehouseId: createdWarehouses[1].id, minStock: 30, maxStock: 200 },
    { name: 'Keyboard', sku: 'KBD-001', category: 'Accessories', quantity: 500, unitPrice: 49.99, warehouseId: createdWarehouses[1].id, minStock: 100, maxStock: 1000 },
    { name: 'Mouse', sku: 'MOU-001', category: 'Accessories', quantity: 450, unitPrice: 29.99, warehouseId: createdWarehouses[2].id, minStock: 100, maxStock: 800 },
    { name: 'Desk Chair', sku: 'CHR-001', category: 'Furniture', quantity: 60, unitPrice: 199.99, warehouseId: createdWarehouses[2].id, minStock: 20, maxStock: 150 }
  ]
  
  for (const item of inventory) {
    await prisma.inventoryItem.create({ data: item })
    console.log(`✅ Inventory created: ${item.name}`)
  }
  
  // Create Orders
  const orders = [
    { orderNumber: 'ORD-001', customerName: 'ABC Corp', customerEmail: 'abc@example.com', customerPhone: '+1234567890', deliveryAddress: '123 Main St, Cape Town', pickupAddress: createdWarehouses[0].address, status: 'COMPLETED', priority: 'NORMAL', scheduledDate: new Date(), completedDate: new Date() },
    { orderNumber: 'ORD-002', customerName: 'XYZ Ltd', customerEmail: 'xyz@example.com', customerPhone: '+1234567891', deliveryAddress: '456 Oak Ave, Durban', pickupAddress: createdWarehouses[1].address, status: 'IN_PROGRESS', priority: 'HIGH', scheduledDate: new Date(), assignedDriverId: createdDrivers[0].id, assignedVehicleId: createdVehicles[0].id },
    { orderNumber: 'ORD-003', customerName: '123 Industries', customerEmail: '123@example.com', customerPhone: '+1234567892', deliveryAddress: '789 Pine Rd, Johannesburg', pickupAddress: createdWarehouses[2].address, status: 'PENDING', priority: 'URGENT', scheduledDate: new Date() },
    { orderNumber: 'ORD-004', customerName: 'Tech Solutions', customerEmail: 'tech@example.com', customerPhone: '+1234567893', deliveryAddress: '321 Elm St, Cape Town', pickupAddress: createdWarehouses[0].address, status: 'ASSIGNED', priority: 'NORMAL', scheduledDate: new Date(), assignedDriverId: createdDrivers[1].id, assignedVehicleId: createdVehicles[1].id }
  ]
  
  for (const order of orders) {
    await prisma.order.create({ data: order })
    console.log(`✅ Order created: ${order.orderNumber}`)
  }
  
  console.log('\n🎉 Database fully seeded with all data!')
  console.log(`\n📊 Summary:`)
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Drivers: ${drivers.length}`)
  console.log(`   - Vehicles: ${vehicles.length}`)
  console.log(`   - Warehouses: ${warehouses.length}`)
  console.log(`   - Inventory Items: ${inventory.length}`)
  console.log(`   - Orders: ${orders.length}`)
}

main()