import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const hash = await bcrypt.hash("admin123", 10)

const user = await prisma.user.upsert({
  where: { email: "admin@fleetmind.com" },
  update: { password: hash },
  create: {
    email: "admin@fleetmind.com",
    name: "Administrator",
    password: hash,
    role: "admin"
  }
})

console.log("Admin user ready:", user.email)
await prisma.$disconnect()