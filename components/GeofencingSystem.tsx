'use client'

import { useState } from 'react'

export function GeofencingSystem() {
  const [zones, setZones] = useState([{ name: 'Warehouse', radius: 200, vehicles: 2 }, { name: 'Downtown', radius: 500, vehicles: 1 }])
  const [newZone, setNewZone] = useState({ name: '', radius: 100 })

  const addZone = () => {
    if (newZone.name) {
      setZones([...zones, { ...newZone, vehicles: 0 }])
      setNewZone({ name: '', radius: 100 })
    }
  }

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>?? Smart Geofencing</h3>
      <div style={{ marginBottom: '15px' }}>
        <input placeholder="Zone Name" value={newZone.name} onChange={(e) => setNewZone({...newZone, name: e.target.value})} style={{ padding: '8px', marginRight: '10px', width: '60%' }} />
        <input placeholder="Radius" value={newZone.radius} onChange={(e) => setNewZone({...newZone, radius: Number(e.target.value)})} style={{ padding: '8px', width: '30%' }} />
        <button onClick={addZone} style={{ marginTop: '10px', padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', width: '100%' }}>Create Zone</button>
      </div>
      {zones.map((z, i) => (
        <div key={i} style={{ padding: '10px', marginTop: '10px', background: '#f1f5f9', borderRadius: '8px' }}>
          <strong>{z.name}</strong> - Radius: {z.radius}m - {z.vehicles} vehicles
        </div>
      ))}
    </div>
  )
}

