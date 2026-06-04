'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  name?: string
  [key: string]: unknown
}

interface ConsistentLayoutProps {
  children: ReactNode
}

interface NavItem {
  name: string
  icon: string
  path: string
  color: string
}

export default function ConsistentLayout({
  children,
}: ConsistentLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')

    if (userData) {
      try {
        setUser(JSON.parse(userData) as User)
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard', color: '#3b82f6' },
    { name: 'Fleet Tracker', icon: '📍', path: '/fleet-tracker', color: '#10b981' },
    { name: 'Vehicles', icon: '🚚', path: '/admin/vehicles', color: '#8b5cf6' },
    { name: 'Drivers', icon: '👨‍✈️', path: '/admin/drivers', color: '#f59e0b' },
    { name: 'Warehouse', icon: '🏭', path: '/warehouse', color: '#ec4899' },
    { name: 'Orders', icon: '📦', path: '/admin/orders', color: '#06b6d4' },
    { name: 'Analytics', icon: '📈', path: '/analytics', color: '#f97316' },
    { name: 'Database', icon: '🗄️', path: '/admin/database', color: '#14b8a6' },
    { name: 'Admin', icon: '⚙️', path: '/admin/portal', color: '#ef4444' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Navigation Bar */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '64px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              }}
            >
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                }}
              >
                FleetMind
              </h1>

              <nav
                style={{
                  display: 'flex',
                  gap: '24px',
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    style={{
                      padding: '8px 0',
                      color: pathname === item.path ? item.color : '#64748b',
                      borderBottom:
                        pathname === item.path
                          ? `2px solid ${item.color}`
                          : 'none',
                      fontWeight: pathname === item.path ? '600' : '400',
                      cursor: 'pointer',
                      background: 'none',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      fontSize: '14px',
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {user && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      background: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {user.name?.charAt(0) || 'A'}
                  </div>

                  <span
                    style={{
                      fontSize: '14px',
                      color: '#1e293b',
                    }}
                  >
                    {user.name || 'Admin'}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px',
        }}
      >
        {children}
      </div>
    </div>
  )
}