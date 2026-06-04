'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Fleet Tracker', href: '/fleet-tracker', icon: '🚚' },
    { name: 'Vehicles', href: '/admin/vehicles', icon: '🚛' },
    { name: 'Drivers', href: '/admin/drivers', icon: '👨‍✈️' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: sidebarOpen ? '260px' : '0',
          height: '100vh',
          background: 'white',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          transition: 'width 0.3s',
          overflow: 'hidden',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FleetMind
          </h1>

          <p
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
            }}
          >
            Logistics OS
          </p>
        </div>

        <nav style={{ padding: '16px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: isActive ? '#dbeafe' : 'transparent',
                  color: isActive ? '#2563eb' : '#6b7280',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {item.icon}
                </span>

                <span style={{ fontWeight: '500' }}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s',
        }}
      >
        <header
          style={{
            background: 'white',
            padding: '16px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              ☰
            </button>

            <div>
              <span style={{ color: '#6b7280' }}>
                Admin Portal
              </span>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}