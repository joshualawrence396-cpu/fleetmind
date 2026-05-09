const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing users
    await prisma.user.deleteMany()
    console.log('Cleared existing users')
    
    // Create users with properly hashed passwords
    const users = [
      { email: 'admin@fleetmind.com', name: 'Admin User', password: 'admin123', role: 'admin' },
      { email: 'driver@fleetmind.com', name: 'Driver User', password: 'driver123', role: 'driver' },
      { email: 'user@fleetmind.com', name: 'Regular User', password: 'user123', role: 'user' }
    ]
    
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      const created = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role
        }
      })
      console.log(`✅ Created: ${created.email} with password: ${user.password} -> hash: ${hashedPassword.substring(0, 20)}...`)
    }
    
    // Verify users were created
    const allUsers = await prisma.user.findMany()
    console.log(`\n📊 Total users in database: ${allUsers.length}`)
    
  } catch (error) {
    console.error('Seed error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
