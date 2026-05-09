'use client'

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-3">
      <div className="stat-card">
        <div className="stat-value">{stats.vehicles}</div>
        <div className="stat-label">Total Vehicles</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.drivers}</div>
        <div className="stat-label">Active Drivers</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.orders}</div>
        <div className="stat-label">Total Orders</div>
      </div>
    </div>
  )
}
