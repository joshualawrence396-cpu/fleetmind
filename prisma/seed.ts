import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fleetmind.com' },
    update: {},
    create: {
      email: 'admin@fleetmind.com',
      name: 'Admin User',
      password: '$2b$10$O/0L/WB7rWacURqk.eEzCOxMUVh0u3.gAwt9mzX1/t3yhNjNjXrum', // admin123
      role: 'admin'
    }
  })
  console.log('✅ Admin user created:', admin.email)

  // Create vehicles
  const vehicles = [
    { registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'AVAILABLE' },
    { registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE' },
    { registration: 'CY345678', make: 'Nissan', model: 'NP200', status: 'AVAILABLE' }
  ]

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { registration: v.registration },
      update: {},
      create: {
        registration: v.registration,
        make: v.make,
        model: v.model,
        status: v.status
      }
    })
    console.log('✅ Vehicle created:', v.registration)
  }

  // Create drivers
  const drivers = [
    { name: 'John Driver', email: 'john@fleetmind.com', phone: '+27721234567', status: 'ACTIVE' },
    { name: 'Mike Smith', email: 'mike@fleetmind.com', phone: '+27729876543', status: 'ACTIVE' },
    { name: 'Sarah Johnson', email: 'sarah@fleetmind.com', phone: '+27721234987', status: 'ACTIVE' }
  ]

  for (const d of drivers) {
    await prisma.driver.upsert({
      where: { email: d.email },
      update: {},
      create: {
        name: d.name,
        email: d.email,
        phone: d.phone,
        status: d.status
      }
    })
    console.log('✅ Driver created:', d.name)
  }

  // Create warehouses
  const warehouses = [
    { name: 'Main Warehouse', location: 'Cape Town', address: '123 Main St, Cape Town', capacity: 1000 },
    { name: 'Branch Warehouse', location: 'Johannesburg', address: '456 Branch Ave, Johannesburg', capacity: 500 }
  ]

  for (const w of warehouses) {
    const existing = await prisma.warehouse.findFirst({
      where: { name: w.name }
    })
    if (!existing) {
      await prisma.warehouse.create({
        data: {
          name: w.name,
          location: w.location,
          address: w.address,
          capacity: w.capacity
        }
      })
      console.log('✅ Warehouse created:', w.name)
    } else {
      console.log('✅ Warehouse already exists:', w.name)
    }
  }

  // Create inventory items
  const items = [
    { name: 'Widget A', sku: 'WID-A-001', category: 'Widgets', quantity: 100, unitPrice: 10.99, minStock: 10 },
    { name: 'Widget B', sku: 'WID-B-002', category: 'Widgets', quantity: 50, unitPrice: 15.99, minStock: 5 },
    { name: 'Gadget X', sku: 'GAD-X-003', category: 'Gadgets', quantity: 25, unitPrice: 25.99, minStock: 3 }
  ]

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        name: item.name,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        minStock: item.minStock,
        warehouseId: (await prisma.warehouse.findFirst())!.id
      }
    })
    console.log('✅ Inventory item created:', item.name)
  }

  // Create sample orders
  const orders = [
    {
      orderNumber: 'ORD-001',
      customerName: 'Alice Cooper',
      customerEmail: 'alice@example.com',
      customerPhone: '+27721111111',
      deliveryAddress: '789 Delivery St, Cape Town',
      pickupAddress: '123 Main St, Cape Town',
      status: 'PENDING'
    },
    {
      orderNumber: 'ORD-002',
      customerName: 'Bob Wilson',
      customerEmail: 'bob@example.com',
      customerPhone: '+27722222222',
      deliveryAddress: '456 Customer Ave, Johannesburg',
      pickupAddress: '456 Branch Ave, Johannesburg',
      status: 'IN_PROGRESS'
    }
  ]

  for (const o of orders) {
    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        deliveryAddress: o.deliveryAddress,
        pickupAddress: o.pickupAddress,
        status: o.status
      }
    })
    console.log('✅ Order created:', o.orderNumber)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })