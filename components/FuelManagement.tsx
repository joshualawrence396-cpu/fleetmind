'use client'

import { useState, useEffect } from 'react'

export function FuelManagement() {
  const [fuelLogs, setFuelLogs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    liters: '',
    cost: '',
    odometer: '',
    fuelType: 'DIESEL',
    station: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [fuelRes, vehicleRes, driverRes] = await Promise.all([
        fetch('/api/fuel'),
        fetch('/api/vehicles'),
        fetch('/api/drivers')
      ])

      if (fuelRes.ok) setFuelLogs(await fuelRes.json())
      if (vehicleRes.ok) setVehicles(await vehicleRes.json())
      if (driverRes.ok) setDrivers(await driverRes.json())
    } catch (error) {
      console.error('Failed to load fuel data:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          vehicleId: '',
          driverId: '',
          liters: '',
          cost: '',
          odometer: '',
          fuelType: 'DIESEL',
          station: ''
        })
        setShowForm(false)
        loadData()
      }
    } catch (error) {
      console.error('Failed to create fuel log:', error)
    }
  }

  const calculateStats = () => {
    const totalCost = fuelLogs.reduce((sum, log) => sum + log.cost, 0)
    const totalLiters = fuelLogs.reduce((sum, log) => sum + log.liters, 0)
    const avgPricePerLiter = totalLiters > 0 ? totalCost / totalLiters : 0

    return { totalCost, totalLiters, avgPricePerLiter }
  }

  const stats = calculateStats()

  if (loading) {
    return <div className="text-center py-8">Loading fuel data...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fuel Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Fuel Log'}
        </button>
      </div>

      {/* Fuel Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Cost</h3>
          <p className="text-2xl font-bold text-blue-600">R{stats.totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Total Liters</h3>
          <p className="text-2xl font-bold text-green-600">{stats.totalLiters.toFixed(1)}L</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Avg Price/Liter</h3>
          <p className="text-2xl font-bold text-purple-600">R{stats.avgPricePerLiter.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Fuel Log Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Fuel Log</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver (Optional)</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Liters</label>
              <input
                type="number"
                step="0.1"
                value={formData.liters}
                onChange={(e) => setFormData({...formData, liters: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost (R)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (km)</label>
              <input
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({...formData, odometer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DIESEL">Diesel</option>
                <option value="PETROL">Petrol</option>
                <option value="LPG">LPG</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Station (Optional)</label>
              <input
                type="text"
                value={formData.station}
                onChange={(e) => setFormData({...formData, station: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Fuel station name"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Save Fuel Log
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

      {/* Fuel Logs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Liters</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fuelLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(log.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {log.vehicle?.registration || 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {log.driver?.name || 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {log.liters}L
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  R{log.cost.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {log.station || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fuelLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No fuel logs recorded yet. Add your first fuel log above.
        </div>
      )}
    </div>
  )
}