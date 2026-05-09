'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UnifiedNavigation() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Fleet Tracker', href: '/fleet-tracker', icon: '🚚' },
    { name: 'Vehicles', href: '/admin/vehicles', icon: '🚛' },
    { name: 'Drivers', href: '/admin/drivers', icon: '👨‍✈️' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Route Optimizer', href: '/optimize', icon: '🗺️' },
    { name: 'Driver App', href: '/driver', icon: '📱' }
  ]

  return (
    <div style={{ 
      background: 'white', 
      padding: '12px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FleetMind</h1>
          <p style={{ fontSize: '10px', color: '#6b7280' }}>Logistics OS</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: pathname === item.href ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: pathname === item.href ? 'white' : '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        Admin Portal
      </div>
    </div>
  )
}
