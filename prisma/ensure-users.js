const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing users
    await prisma.user.deleteMany()
    console.log('Cleared existing users')
    
    // Create users with plain text for now (will hash)
    const users = [
      { email: 'admin@fleetmind.com', name: 'Admin User', password: 'admin123', role: 'admin' },
      { email: 'driver@fleetmind.com', name: 'Driver User', password: 'driver123', role: 'driver' },
      { email: 'user@fleetmind.com', name: 'Regular User', password: 'user123', role: 'user' }
    ]
    
    for (const user of users) {
      const hashed = await bcrypt.hash(user.password, 10)
      const created = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: hashed,
          role: user.role
        }
      })
      console.log(`✅ Created: ${created.email} with role ${created.role}`)
    }
    
    // Verify
    const count = await prisma.user.count()
    console.log(`\n📊 Total users in database: ${count}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
