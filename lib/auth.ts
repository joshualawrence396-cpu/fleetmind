import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user || !user.password) return null
          const valid = await bcrypt.compare(credentials.password, user.password)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role, plan: user.plan, company: user.company }
        } catch { return null }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || "user"
        token.plan = (user as any).plan || "Basic"
        token.company = (user as any).company
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role || "user"
        ;(session.user as any).plan = token.plan || "Basic"
        ;(session.user as any).company = token.company
      }
      return session
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET || "fleetmind-secret-2026-sa",
}
