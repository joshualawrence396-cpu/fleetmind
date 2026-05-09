'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function MasterLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/fleet-tracker', name: 'Fleet Tracker', icon: '🚛' },
    { path: '/vehicles', name: 'Vehicles', icon: '🚗' },
    { path: '/drivers', name: 'Drivers', icon: '👤' },
    { path: '/analytics', name: 'Analytics', icon: '📈' },
    { path: '/orders', name: 'Orders', icon: '📦' },
    { path: '/route-optimizer', name: 'Route Optimizer', icon: '🗺️' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '70px',
        background: '#1e293b',
        color: 'white',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        overflowX: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen && <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>FleetMind</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: pathname === item.path ? '#60a5fa' : '#cbd5e1',
                textDecoration: 'none',
                transition: 'background 0.2s',
                background: pathname === item.path ? '#334155' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
              onMouseLeave={(e) => e.currentTarget.style.background = pathname === item.path ? '#334155' : 'transparent'}
            >
              <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarOpen ? '260px' : '70px', flex: 1, transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Fleet Management System</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user && (
              <>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
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
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
