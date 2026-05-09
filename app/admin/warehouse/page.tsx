'use client'

import { useState, useEffect } from 'react'

export default function AdminWarehousePage() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({
    code: '',
    name: '',
    latitude: '',
    longitude: '',
    totalArea: ''
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/v1/warehouses')
      const data = await response.json()
      setWarehouses(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setWarehouses([])
      setLoading(false)
    }
  }

  const addWarehouse = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newWarehouse,
          latitude: parseFloat(newWarehouse.latitude),
          longitude: parseFloat(newWarehouse.longitude),
          totalArea: parseFloat(newWarehouse.totalArea)
        })
      })
      if (response.ok) {
        fetchWarehouses()
        setShowForm(false)
        setNewWarehouse({ code: '', name: '', latitude: '', longitude: '', totalArea: '' })
      }
    } catch (error) {
      console.error('Error adding warehouse:', error)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Warehouse Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
        >
          + Add Warehouse
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>New Warehouse</h2>
          <form onSubmit={addWarehouse} style={{ display: 'grid', gap: '16px' }}>
            <input type="text" placeholder="Code" value={newWarehouse.code} onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value})} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} required />
            <input type="text" placeholder="Name" value={newWarehouse.name} onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} required />
            <input type="number" placeholder="Latitude" value={newWarehouse.latitude} onChange={(e) => setNewWarehouse({...newWarehouse, latitude: e.target.value})} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} required />
            <input type="number" placeholder="Longitude" value={newWarehouse.longitude} onChange={(e) => setNewWarehouse({...newWarehouse, longitude: e.target.value})} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} required />
            <input type="number" placeholder="Total Area (m²)" value={newWarehouse.totalArea} onChange={(e) => setNewWarehouse({...newWarehouse, totalArea: e.target.value})} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Save Warehouse</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{warehouse.name}</h3>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Code: {warehouse.code}</p>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>Location: {warehouse.latitude}, {warehouse.longitude}</p>
            {warehouse.totalArea && <p style={{ color: '#6b7280', marginTop: '4px' }}>Area: {warehouse.totalArea} m²</p>}
            <span style={{ display: 'inline-block', marginTop: '12px', padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px' }}>{warehouse.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
