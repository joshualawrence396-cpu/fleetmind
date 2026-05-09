'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WarehousePage() {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({
    code: '',
    name: '',
    latitude: '',
    longitude: '',
    address: ''
  })

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const res = await fetch('/api/v1/warehouses')
      const data = await res.json()
      setWarehouses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddWarehouse = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/v1/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newWarehouse.code,
          name: newWarehouse.name,
          latitude: parseFloat(newWarehouse.latitude),
          longitude: parseFloat(newWarehouse.longitude),
          address: { address: newWarehouse.address }
        })
      })
      if (response.ok) {
        alert('Warehouse added successfully!')
        setShowModal(false)
        setNewWarehouse({ code: '', name: '', latitude: '', longitude: '', address: '' })
        fetchWarehouses()
      } else {
        alert('Failed to add warehouse')
      }
    } catch (error) {
      alert('Error adding warehouse')
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Warehouse Management</h1>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Dashboard</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e' }}>Warehouses</h1>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Warehouse</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' }}>{warehouse.name}</h3>
                <span style={{ padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontSize: '12px' }}>ACTIVE</span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Code: {warehouse.code}</p>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Location: {warehouse.latitude}, {warehouse.longitude}</p>
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => router.push('/warehouse/' + warehouse.id)} 
                  style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Manage Inventory →
                </button>
              </div>
            </div>
          ))}
        </div>

        {warehouses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#666' }}>No warehouses yet. Click "Add Warehouse" to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Add New Warehouse</h2>
            <form onSubmit={handleAddWarehouse}>
              <input type="text" placeholder="Warehouse Name" value={newWarehouse.name} onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} required />
              <input type="text" placeholder="Warehouse Code" value={newWarehouse.code} onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} required />
              <input type="number" step="any" placeholder="Latitude" value={newWarehouse.latitude} onChange={(e) => setNewWarehouse({...newWarehouse, latitude: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} required />
              <input type="number" step="any" placeholder="Longitude" value={newWarehouse.longitude} onChange={(e) => setNewWarehouse({...newWarehouse, longitude: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} required />
              <textarea placeholder="Address" value={newWarehouse.address} onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '80px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add Warehouse</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}