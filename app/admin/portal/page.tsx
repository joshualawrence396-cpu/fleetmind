'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPortal() {
  const router = useRouter()
  const [stats, setStats] = useState({ carriers: 1, vehicles: 3, orders: 0 })

  useEffect(() => {
    fetch('/api/v1/vehicles')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, vehicles: data.length || 3 })))
      .catch(() => {})
  }, [])

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/admin/portal' },
    { id: 'database', name: 'Database Manager', icon: '🗄️', path: '/admin/database', color: '#3b82f6' },
    { id: 'carriers', name: 'Carriers', icon: '🏢', path: '/admin/carriers' },
    { id: 'shippers', name: 'Shippers', icon: '📦', path: '/admin/shippers' },
    { id: 'couriers', name: 'Couriers', icon: '🚚', path: '/admin/couriers' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚛', path: '/admin/vehicles' },
    { id: 'drivers', name: 'Drivers', icon: '👨‍✈️', path: '/admin/drivers' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #2d2d44' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Admin Portal</h2>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>FleetMind CMS</p>
        </div>
        <nav style={{ padding: '16px' }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              onClick={() => router.push(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#2d2d44'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Dashboard</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Admin Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.carriers}</div>
            <div>Active Carriers</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{stats.vehicles}</div>
            <div>Active Vehicles</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.orders}</div>
            <div>Total Orders</div>
          </div>
        </div>
      </div>
    </div>
  )
}
