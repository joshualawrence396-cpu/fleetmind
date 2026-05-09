const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear all tables
    await prisma.order.deleteMany()
    await prisma.inventoryItem.deleteMany()
    await prisma.warehouse.deleteMany()
    await prisma.vehicle.deleteMany()
    await prisma.driver.deleteMany()
    await prisma.user.deleteMany()
    
    console.log('Cleared existing data')
    
    // Create Users
    const users = [
      { email: 'admin@fleetmind.com', name: 'Admin User', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
      { email: 'driver@fleetmind.com', name: 'Driver User', password: bcrypt.hashSync('driver123', 10), role: 'driver' },
      { email: 'user@fleetmind.com', name: 'Regular User', password: bcrypt.hashSync('user123', 10), role: 'user' }
    ]
    
    for (const user of users) {
      await prisma.user.create({ data: user })
      console.log(`✅ User: ${user.email}`)
    }
    
    // Create Drivers
    const drivers = [
      { name: 'John Doe', email: 'john@fleetmind.com', phone: '+1234567890', status: 'ACTIVE' },
      { name: 'Jane Smith', email: 'jane@fleetmind.com', phone: '+1234567891', status: 'ACTIVE' }
    ]
    
    for (const driver of drivers) {
      await prisma.driver.create({ data: driver })
      console.log(`✅ Driver: ${driver.name}`)
    }
    
    // Create Vehicles
    const vehicles = [
      { registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'ON_ROUTE', latitude: -33.9249, longitude: 18.4241 },
      { registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE', latitude: -33.9229, longitude: 18.3859 }
    ]
    
    for (const vehicle of vehicles) {
      await prisma.vehicle.create({ data: vehicle })
      console.log(`✅ Vehicle: ${vehicle.registration}`)
    }
    
    // Create Warehouses
    const warehouses = [
      { name: 'Main Warehouse', location: 'Cape Town', address: '123 Main St', capacity: 1000, currentStock: 450 },
      { name: 'North Hub', location: 'Durban', address: '456 Beach Rd', capacity: 800, currentStock: 320 }
    ]
    
    const createdWarehouses = []
    for (const warehouse of warehouses) {
      const created = await prisma.warehouse.create({ data: warehouse })
      createdWarehouses.push(created)
      console.log(`✅ Warehouse: ${warehouse.name}`)
    }
    
    // Create Inventory
    const inventory = [
      { name: 'Laptop', sku: 'LAP-001', category: 'Electronics', quantity: 150, unitPrice: 999.99, warehouseId: createdWarehouses[0].id, minStock: 50, maxStock: 500 },
      { name: 'Monitor', sku: 'MON-001', category: 'Electronics', quantity: 80, unitPrice: 299.99, warehouseId: createdWarehouses[0].id, minStock: 30, maxStock: 200 }
    ]
    
    for (const item of inventory) {
      await prisma.inventoryItem.create({ data: item })
      console.log(`✅ Inventory: ${item.name}`)
    }
    
    // Create Orders
    const orders = [
      { orderNumber: 'ORD-001', customerName: 'ABC Corp', customerEmail: 'abc@example.com', customerPhone: '+1234567890', deliveryAddress: '123 Main St', pickupAddress: 'Warehouse 1', status: 'COMPLETED', priority: 'NORMAL' },
      { orderNumber: 'ORD-002', customerName: 'XYZ Ltd', customerEmail: 'xyz@example.com', customerPhone: '+1234567891', deliveryAddress: '456 Oak Ave', pickupAddress: 'Warehouse 1', status: 'PENDING', priority: 'HIGH' }
    ]
    
    for (const order of orders) {
      await prisma.order.create({ data: order })
      console.log(`✅ Order: ${order.orderNumber}`)
    }
    
    console.log('\n🎉 Database seeded successfully!')
  } catch (error) {
    console.error('Seed error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()