const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verify() {
  const users = await prisma.user.findMany()
  console.log(`\n📊 Total users: ${users.length}`)
  users.forEach(u => {
    console.log(`   - ${u.email} (${u.role})`)
  })
  await prisma.$disconnect()
}

verify()
