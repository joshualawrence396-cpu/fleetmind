'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Fleet', icon: '🚚', path: '/admin/vehicles' },
    { name: 'Drivers', icon: '👨‍✈️', path: '/admin/drivers' },
    { name: 'Warehouse', icon: '🏭', path: '/warehouse' },
    { name: 'Orders', icon: '📦', path: '/admin/orders' },
    { name: 'Analytics', icon: '📈', path: '/analytics' },
    { name: 'Database', icon: '🗄️', path: '/admin/database' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6fa' }}>
      <div style={{ width: '240px', background: '#1a1a2e', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #2d2d44' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>FleetMind</h2>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Logistics Platform</p>
        </div>
        <nav style={{ flex: 1, padding: '16px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: isActive ? '#2d2d44' : 'transparent',
                  color: isActive ? 'white' : '#aaa',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #2d2d44' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ fontSize: '12px' }}>
              <div>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '10px', color: '#888' }}>Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px' }}>
        {children}
      </div>
    </div>
  )
}
