const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Get admin user
  const user = await prisma.user.findFirst({ where: { email: "admin@fleetmind.com" } });
  if (!user) { console.log("No admin user found - run seed-admin.cjs first"); return; }

  // Add test drivers
  const drivers = ["Sipho Nkosi","Priya Naidoo","Johan van der Berg","Nomsa Dlamini","Themba Zulu"];
  for (let i = 0; i < drivers.length; i++) {
    const existing = await prisma.driver.findFirst({ where: { name: drivers[i] } });
    if (!existing) {
      await prisma.driver.create({ data: {
        name: drivers[i], email: drivers[i].toLowerCase().replace(/ /g,".")+`@fleetmind.co.za`,
        phone: `+2760${i}000000${i}`, licenseNumber: `ZA${100+i}`, licenseType: i % 2 === 0 ? "CODE10" : "CODE14",
        status: "ACTIVE", rating: 4.2 + (i * 0.1)
      }});
      console.log("Created driver:", drivers[i]);
    }
  }

  // Add test vehicles with SA GPS coords
  const locations = [
    { lat: -33.9249, lng: 18.4241, city: "Cape Town" },
    { lat: -26.2041, lng: 28.0473, city: "Johannesburg" },
    { lat: -29.8587, lng: 31.0218, city: "Durban" },
    { lat: -25.7479, lng: 28.2293, city: "Pretoria" },
    { lat: -33.9608, lng: 25.6022, city: "Port Elizabeth" },
  ];
  const registrations = ["CA 123-456","GP 234-567","KZN 345-678","GP 456-789","EC 567-890"];
  for (let i = 0; i < registrations.length; i++) {
    const existing = await prisma.vehicle.findFirst({ where: { registration: registrations[i] } });
    if (!existing) {
      await prisma.vehicle.create({ data: {
        registration: registrations[i], make: ["Toyota","Isuzu","Ford","Hino","Mercedes"][i],
        model: ["Land Cruiser","D-Max","Ranger","500","Sprinter"][i], year: 2020 + i,
        type: i < 2 ? "VAN_LARGE" : "TRUCK_MEDIUM", fuelType: "DIESEL",
        status: i < 3 ? "ON_ROUTE" : "AVAILABLE",
        latitude: locations[i].lat + (Math.random() - 0.5) * 0.05,
        longitude: locations[i].lng + (Math.random() - 0.5) * 0.05,
        odometerKm: 50000 + i * 15000, capacityKg: 1500 + i * 500,
      }});
      console.log("Created vehicle:", registrations[i]);
    }
  }

  // Add test orders
  const customers = [
    { name: "Woolworths CT", email: "logistics@woolworths.co.za", phone: "+27211234567", addr: "Long Street, Cape Town, 8001" },
    { name: "Pick n Pay JHB", email: "supply@pnp.co.za", phone: "+27113456789", addr: "Sandton Drive, Johannesburg, 2146" },
    { name: "Checkers DBN", email: "orders@checkers.co.za", phone: "+27312345678", addr: "Berea Road, Durban, 4001" },
  ];
  for (let i = 0; i < customers.length; i++) {
    const c = customers[i];
    const existing = await prisma.order.findFirst({ where: { customerEmail: c.email } });
    if (!existing) {
      await prisma.order.create({ data: {
        orderNumber: `ORD-${Date.now()}-${i}`, customerName: c.name, customerEmail: c.email,
        customerPhone: c.phone, deliveryAddress: c.addr, pickupAddress: "FleetMind Depot, Cape Town",
        status: i === 0 ? "IN_PROGRESS" : i === 1 ? "PENDING" : "COMPLETED",
        priority: "NORMAL", totalAmount: 1500 + i * 500,
      }});
      console.log("Created order for:", c.name);
    }
  }

  console.log("\nSeed complete!");
  console.log("Drivers:", await prisma.driver.count());
  console.log("Vehicles:", await prisma.vehicle.count());
  console.log("Orders:", await prisma.order.count());
}

main().catch(console.error).finally(() => prisma.$disconnect());
