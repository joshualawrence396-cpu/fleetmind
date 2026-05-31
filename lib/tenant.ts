import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

const prisma = new PrismaClient()

export async function getTenantFilter() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user?.id) return {}
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { carrierId: true } })
    if (dbUser?.carrierId) return { carrierId: dbUser.carrierId }
    return { userId: user.id }
  } catch { return {} }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user?.email) return null
    return prisma.user.findUnique({ where: { email: user.email } })
  } catch { return null }
}