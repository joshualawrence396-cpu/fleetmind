'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function UnifiedLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard', color: '#3b82f6' },
    { name: 'Fleet Tracker', icon: '📍', path: '/fleet-tracker', color: '#10b981' },
    { name: 'Vehicles', icon: '🚚', path: '/admin/vehicles', color: '#8b5cf6' },
    { name: 'Drivers', icon: '👨‍✈️', path: '/admin/drivers', color: '#f59e0b' },
    { name: 'Warehouse', icon: '🏭', path: '/warehouse', color: '#ec4899' },
    { name: 'Orders', icon: '📦', path: '/admin/orders', color: '#06b6d4' },
    { name: 'Analytics', icon: '📈', path: '/analytics', color: '#f97316' },
    { name: 'Optimize', icon: '🗺️', path: '/optimize', color: '#14b8a6' },
    { name: 'Admin', icon: '⚙️', path: '/admin/portal', color: '#ef4444' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: sidebarOpen ? '260px' : '0',
        height: '100vh',
        background: '#1e293b',
        transition: 'width 0.3s',
        overflow: 'hidden',
        zIndex: 1000,
        borderRight: '1px solid #334155'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>FleetMind</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Logistics OS</p>
        </div>
        
        <nav style={{ padding: '16px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  background: isActive ? item.color : 'transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#334155'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ color: isActive ? 'white' : '#cbd5e1', fontWeight: isActive ? 'bold' : 'normal' }}>{item.name}</span>
              </div>
            )
          })}
        </nav>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>{user?.name || 'Admin'}</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>{user?.role || 'Administrator'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '260px' : '0',
        transition: 'margin-left 0.3s',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{
          background: '#1e293b',
          padding: '16px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#cbd5e1'
            }}
          >
            ☰
          </button>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', padding: '4px 12px', borderRadius: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '12px' }}>● System Online</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
