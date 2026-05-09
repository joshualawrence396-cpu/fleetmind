'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({ children, allowedRoles = null }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    
    if (status === 'authenticated' && allowedRoles && !allowedRoles.includes(session?.user?.role)) {
      router.push('/unauthorized')
    }
  }, [status, session, router, allowedRoles])

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    )
  }

  if (status === 'authenticated') {
    return <>{children}</>
  }

  return null
}
