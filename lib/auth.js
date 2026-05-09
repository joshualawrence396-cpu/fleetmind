'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth/login')
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }

  const requireRole = (roles) => {
    if (!loading && user && !roles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }

  return { user, loading, logout, requireAuth, requireRole }
}

// Protected route wrapper
export function withAuth(Component, requiredRoles = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, requireAuth, requireRole } = useAuth()
    
    useEffect(() => {
      requireAuth()
      if (requiredRoles) {
        requireRole(requiredRoles)
      }
    }, [loading])

    if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
    }

    if (!user) {
      return null
    }

    return <Component {...props} user={user} />
  }
}
