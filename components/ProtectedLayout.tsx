'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type ProtectedLayoutProps = {
  children: ReactNode
  allowedRoles?: string[] | null
}

export default function ProtectedLayout({
  children,
  allowedRoles = null,
}: ProtectedLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (
      allowedRoles &&
      session.user &&
      !allowedRoles.includes((session.user as any).role)
    ) {
      router.push('/unauthorized')
    }
  }, [session, status, router, allowedRoles])

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading...
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}