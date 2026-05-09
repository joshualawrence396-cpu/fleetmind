'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WarehouseDetail({ params }) {
  const router = useRouter()
  const [warehouse, setWarehouse] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // In Next.js 15, params is a Promise
      const resolvedParams = await params
      const warehouseId = resolvedParams.id
      
      // Fetch warehouse details
      const warehousesRes = await fetch('/api/v1/warehouses')
      const warehouses = await warehousesRes.json()
      const found = warehouses.find(w => w.id === warehouseId)
      setWarehouse(found)
      
      // Fetch inventory
      const inventoryRes = await fetch('/api/v1/inventory')
      const items = await inventoryRes.json()
      setInventory(Array.isArray(items) ? items : [])
      setLoading(false)
    }
    loadData()
  }, [params])

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  if (!warehouse) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Warehouse not found</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>{warehouse.name} - Inventory</h1>
          <button onClick={() => router.push('/warehouse')} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Warehouses</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Warehouse Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div><p style={{ color: '#666' }}>Code</p><p style={{ fontWeight: '500' }}>{warehouse.code}</p></div>
            <div><p style={{ color: '#666' }}>Name</p><p style={{ fontWeight: '500' }}>{warehouse.name}</p></div>
            <div><p style={{ color: '#666' }}>Location</p><p style={{ fontWeight: '500' }}>Lat: {warehouse.latitude}, Lng: {warehouse.longitude}</p></div>
            <div><p style={{ color: '#666' }}>Status</p><p><span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px' }}>Active</span></p></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Inventory Stock</h2>
          {inventory.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No inventory items found.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {inventory.map(item => (
                <div key={item.id} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{item.sku}</div>
                  <div style={{ color: '#666', fontSize: '14px' }}>{item.title}</div>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px' }}>Stock: {item.quantity} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}