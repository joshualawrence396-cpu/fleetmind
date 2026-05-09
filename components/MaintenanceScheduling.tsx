'use client'

import { useState, useEffect } from 'react'

export function MaintenanceScheduling() {
  const [maintenance, setMaintenance] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'OIL_CHANGE',
    description: '',
    dueDate: '',
    dueKm: '',
    priority: 'NORMAL',
    cost: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [maintenanceRes, vehicleRes] = await Promise.all([
        fetch('/api/maintenance'),
        fetch('/api/vehicles')
      ])

      if (maintenanceRes.ok) setMaintenance(await maintenanceRes.json())
      if (vehicleRes.ok) setVehicles(await vehicleRes.json())
    } catch (error) {
      console.error('Failed to load maintenance data:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          vehicleId: '',
          type: 'OIL_CHANGE',
          description: '',
          dueDate: '',
          dueKm: '',
          priority: 'NORMAL',
          cost: '',
          notes: ''
        })
        setShowForm(false)
        loadData()
      }
    } catch (error) {
      console.error('Failed to create maintenance record:', error)
    }
  }

  const markCompleted = async (id) => {
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Failed to update maintenance:', error)
    }
  }

  const getStatusColor = (status, dueDate) => {
    if (status === 'COMPLETED') return 'text-green-600 bg-green-100'
    if (status === 'OVERDUE') return 'text-red-600 bg-red-100'

    const now = new Date()
    const due = new Date(dueDate)
    const daysDiff = (due - now) / (1000 * 60 * 60 * 24)

    if (daysDiff < 0) return 'text-red-600 bg-red-100'
    if (daysDiff <= 7) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-700 bg-red-100'
      case 'HIGH': return 'text-orange-700 bg-orange-100'
      case 'NORMAL': return 'text-blue-700 bg-blue-100'
      case 'LOW': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const maintenanceTypes = [
    'OIL_CHANGE',
    'BRAKE_CHECK',
    'TYRE_ROTATION',
    'BATTERY_CHECK',
    'COOLANT_FLUSH',
    'TRANSMISSION_SERVICE',
    'AIR_FILTER_REPLACEMENT',
    'SPARK_PLUGS',
    'GENERAL_INSPECTION'
  ]

  if (loading) {
    return <div className="text-center py-8">Loading maintenance data...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Scheduling</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Schedule Maintenance'}
        </button>
      </div>

      {/* Maintenance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900">Overdue</h3>
          <p className="text-2xl font-bold text-red-600">
            {maintenance.filter(m => m.status === 'OVERDUE').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900">Due Soon</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {maintenance.filter(m => {
              if (m.status !== 'PENDING') return false
              const daysDiff = (new Date(m.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
              return daysDiff <= 7 && daysDiff >= 0
            }).length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Pending</h3>
          <p className="text-2xl font-bold text-blue-600">
            {maintenance.filter(m => m.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {maintenance.filter(m => m.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Add Maintenance Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Schedule Maintenance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.registration} - {vehicle.make} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {maintenanceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe the maintenance task"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Kilometers</label>
              <input
                type="number"
                value={formData.dueKm}
                onChange={(e) => setFormData({...formData, dueKm: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost (R)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Optional"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Schedule Maintenance
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Maintenance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenance.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {item.vehicle?.registration || 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {item.type.replace('_', ' ')}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(item.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status, item.dueDate)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => markCompleted(item.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maintenance.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No maintenance scheduled yet. Schedule your first maintenance task above.
        </div>
      )}
    </div>
  )
}