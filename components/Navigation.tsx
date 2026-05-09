'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Fleet Tracker', path: '/fleet-tracker', icon: '📍' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: '🚚' },
    { name: 'Drivers', path: '/admin/drivers', icon: '👨‍✈️' },
    { name: 'Orders', path: '/admin/orders', icon: '📦' },
    { name: 'Couriers', path: '/admin/couriers', icon: '🚛' },
    { name: 'Analytics', path: '/analytics', icon: '📈' }
  ]

  return (
    <div style={{ background: 'white', padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {menuItems.map(item => (
        <button key={item.path} onClick={() => router.push(item.path)} style={{ padding: '8px 16px', background: pathname === item.path ? '#3b82f6' : 'transparent', color: pathname === item.path ? 'white' : '#4b5563', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{item.icon}</span> <span>{item.name}</span>
        </button>
      ))}
    </div>
  )
}
