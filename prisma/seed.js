const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.inventoryItem.deleteMany()
  await prisma.order.deleteMany()
  prisma.warehouse.deleteMany()
  prisma.vehicle.deleteMany()
  prisma.driver.deleteMany()
  await prisma.user.deleteMany()
  
  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@fleetmind.com',
      name: 'Administrator',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin'
    }
  })
  
  // Create drivers
  await prisma.driver.createMany({
    data: [
      { name: 'John Doe', email: 'john@fleetmind.com', phone: '+1234567890', status: 'ACTIVE' },
      { name: 'Jane Smith', email: 'jane@fleetmind.com', phone: '+1234567891', status: 'ACTIVE' }
    ]
  })
  
  // Create vehicles
  await prisma.vehicle.createMany({
    data: [
      { registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'ON_ROUTE', latitude: -33.9249, longitude: 18.4241 },
      { registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE', latitude: -33.9229, longitude: 18.3859 }
    ]
  })
  
  // Create warehouses
  await prisma.warehouse.createMany({
    data: [
      { name: 'Main Warehouse', location: 'Cape Town', address: '123 Industrial Rd', capacity: 1000, currentStock: 450 },
      { name: 'North Hub', location: 'Durban', address: '456 Commerce Ave', capacity: 800, currentStock: 320 }
    ]
  })
  
  // Create orders
  await prisma.order.createMany({
    data: [
      { orderNumber: 'ORD-001', customerName: 'ABC Corp', customerEmail: 'abc@example.com', customerPhone: '+1234567890', deliveryAddress: '123 Main St', pickupAddress: 'Main Warehouse', status: 'COMPLETED', priority: 'NORMAL' },
      { orderNumber: 'ORD-002', customerName: 'XYZ Ltd', customerEmail: 'xyz@example.com', customerPhone: '+1234567891', deliveryAddress: '456 Oak Ave', pickupAddress: 'North Hub', status: 'IN_PROGRESS', priority: 'HIGH' }
    ]
  })
  
  console.log('✅ Database seeded!')
}

main()