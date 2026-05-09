'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MasterLayout from '@/components/MasterLayout'

export default function VehiclesPage() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ registration: '', make: '', model: '', type: 'VAN_LARGE' })

  useEffect(() => {
    fetch('/api/v1/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => setVehicles([]))
  }, [])

  const addVehicle = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/v1/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVehicle)
    })
    if (res.ok) {
      const vehicle = await res.json()
      setVehicles([...vehicles, vehicle])
      setShowForm(false)
      setNewVehicle({ registration: '', make: '', model: '', type: 'VAN_LARGE' })
    }
  }

  return (
    <MasterLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Vehicles</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Vehicle</button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Registration</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Make/Model</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr key={v.id} style={{ borderBottom: i < vehicles.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{v.registration}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{v.make} {v.model}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontSize: '11px' }}>Active</span></td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{v.type?.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No vehicles yet</div>}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Add Vehicle</h2>
            <form onSubmit={addVehicle}>
              <input type="text" placeholder="Registration" value={newVehicle.registration} onChange={(e) => setNewVehicle({...newVehicle, registration: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} required />
              <input type="text" placeholder="Make" value={newVehicle.make} onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} required />
              <input type="text" placeholder="Model" value={newVehicle.model} onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px' }} required />
              <select value={newVehicle.type} onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '6px' }}>
                <option value="VAN_SMALL">Van Small</option>
                <option value="VAN_LARGE">Van Large</option>
                <option value="TRUCK_LIGHT">Truck Light</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MasterLayout>
  )
}
