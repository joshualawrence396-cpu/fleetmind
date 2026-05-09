import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.()
    console.log('✅ Database connected successfully!')
    const result = await prisma.SELECT 1 as connected
    console.log('Query test:', result)
    await prisma.()
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

test()
