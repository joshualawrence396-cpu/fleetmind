'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function UserFriendlyNav() {
  const router = useRouter()
  const pathname = usePathname()

  const mainActions = [
    { name: 'Dashboard', icon: '🏠', description: 'Main overview', path: '/dashboard', color: '#3b82f6' },
    { name: 'Track Order', icon: '📍', description: 'Track deliveries', path: '/fleet-tracker', color: '#10b981' },
    { name: 'My Fleet', icon: '🚚', description: 'View vehicles', path: '/admin/vehicles', color: '#8b5cf6' },
    { name: 'Drivers', icon: '👨‍✈️', description: 'Manage drivers', path: '/admin/drivers', color: '#f59e0b' },
    { name: 'Analytics', icon: '📊', description: 'See stats', path: '/analytics', color: '#ec4899' }
  ]

  return (
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      flexWrap: 'wrap',
      marginBottom: '32px'
    }}>
      {mainActions.map((action) => {
        const isActive = pathname === action.path
        return (
          <button
            key={action.path}
            onClick={() => router.push(action.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              background: isActive ? action.color : 'white',
              border: isActive ? 'none' : '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = action.color
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.color = '#1f2937'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <span style={{ fontSize: '24px' }}>{action.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '14px',
                color: isActive ? 'white' : '#1f2937'
              }}>
                {action.name}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: isActive ? 'rgba(255,255,255,0.8)' : '#6b7280' 
              }}>
                {action.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
