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
    { name: 'Fuel', href: '/fuel', icon: '⛽' },
    { name: 'Maintenance', href: '/maintenance', icon: '🔧' },
    { name: 'Chat', href: '/chat', icon: '💬' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
    { name: 'API Docs', href: '/api-docs', icon: '📚' },
    { name: 'Testing', href: '/testing', icon: '🧪' },
    { name: 'Monitoring', href: '/monitoring', icon: '📡' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Route Optimizer', href: '/optimize', icon: '🗺️' },
    { name: 'Driver App', href: '/driver', icon: '📱' }
  ]

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/10">
            FleetMind
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600 md:flex">
            <span className="text-slate-400">Logistics OS</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end overflow-x-auto pb-1">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${pathname === item.href ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <span>{item.icon}</span>
                <span className="ml-2 hidden sm:inline">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden min-w-[180px] items-center justify-end gap-3 text-sm text-slate-600 md:flex">
          <span className="rounded-full bg-slate-100 px-3 py-2">Enterprise</span>
          <span className="font-semibold text-slate-900">Admin</span>
        </div>
      </div>
    </div>
  )
}
