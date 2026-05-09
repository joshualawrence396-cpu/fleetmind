'use client'

import { useState, useEffect } from 'react'

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch('/api/v1/vehicles')
      .then(res => res.json())
      .then(setVehicles)
      .catch(() => setVehicles([]))
  }, [])

  return (
    <div className="card">
      <div className="card-header">Recent Vehicles</div>
      <div className="card-body">
        {vehicles.slice(0, 5).map(vehicle => (
          <div key={vehicle.id} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-50 rounded">
            <span>{vehicle.registration}</span>
            <span className="badge badge-success">{vehicle.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
