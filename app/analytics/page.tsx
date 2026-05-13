'use client'

import { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    deliveryRate: 0,
    activeDrivers: 0,
    totalVehicles: 3,
    warehouses: 1
  })

  useEffect(() => {
    fetch('/api/v1/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.metrics) {
          setMetrics(data.metrics)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <PageShell
      title="Analytics Dashboard"
      subtitle="Fleet performance metrics, order delivery rates, and system health in one unified view."
    >
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="text-4xl font-semibold text-sky-600">{metrics.totalOrders}</div>
          <p className="mt-3 text-sm text-slate-500">Total Orders</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="text-4xl font-semibold text-emerald-600">{metrics.deliveryRate}%</div>
          <p className="mt-3 text-sm text-slate-500">Delivery Rate</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="text-4xl font-semibold text-violet-600">{metrics.activeDrivers}</div>
          <p className="mt-3 text-sm text-slate-500">Active Drivers</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="text-4xl font-semibold text-amber-600">{metrics.totalVehicles}</div>
          <p className="mt-3 text-sm text-slate-500">Fleet Size</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">System Health</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">API Server</p>
            <p className="mt-2 font-semibold text-slate-900">Operational</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Database</p>
            <p className="mt-2 font-semibold text-slate-900">Connected</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Warehouses</p>
            <p className="mt-2 font-semibold text-slate-900">{metrics.warehouses}</p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
