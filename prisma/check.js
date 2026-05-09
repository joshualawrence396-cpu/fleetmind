const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    const users = await prisma.user.findMany()
    console.log(`\n📊 Total users in database: ${users.length}`)
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role}) - Has password: ${!!u.password}`)
    })
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
