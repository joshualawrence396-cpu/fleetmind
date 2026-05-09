'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DatabaseManager() {
  const router = useRouter()
  const [activeTable, setActiveTable] = useState('vehicles')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  const tables = [
    { id: 'vehicles', name: 'Vehicles', icon: '🚚', api: '/api/v1/vehicles' },
    { id: 'drivers', name: 'Drivers', icon: '👨‍✈️', api: '/api/v1/drivers' },
    { id: 'warehouses', name: 'Warehouses', icon: '🏭', api: '/api/v1/warehouses' },
    { id: 'inventory', name: 'Inventory', icon: '📦', api: '/api/v1/inventory' },
    { id: 'orders', name: 'Orders', icon: '📝', api: '/api/v1/orders' },
    { id: 'shipments', name: 'Shipments', icon: '✈️', api: '/api/v1/shipments' }
  ]

  useEffect(() => {
    fetchData()
  }, [activeTable])

  const fetchData = async () => {
    setLoading(true)
    try {
      const table = tables.find(t => t.id === activeTable)
      if (table) {
        const res = await fetch(table.api)
        const json = await res.json()
        setData(Array.isArray(json) ? json : [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const table = tables.find(t => t.id === activeTable)
        const res = await fetch(table.api + '/' + id, { method: 'DELETE' })
        if (res.ok) {
          alert('Item deleted successfully')
          fetchData()
        } else {
          alert('Failed to delete item')
        }
      } catch (error) {
        alert('Error deleting item')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const table = tables.find(t => t.id === activeTable)
      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem ? table.api + '/' + editingItem.id : table.api
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        alert(editingItem ? 'Item updated successfully' : 'Item added successfully')
        setShowModal(false)
        fetchData()
      } else {
        alert('Operation failed')
      }
    } catch (error) {
      alert('Error processing request')
    }
  }

  const renderFormFields = () => {
    switch (activeTable) {
      case 'vehicles':
        return (
          <>
            <input type="text" placeholder="Registration *" value={formData.registration || ''} onChange={(e) => setFormData({...formData, registration: e.target.value})} style={inputStyle} required />
            <input type="text" placeholder="Make *" value={formData.make || ''} onChange={(e) => setFormData({...formData, make: e.target.value})} style={inputStyle} required />
            <input type="text" placeholder="Model *" value={formData.model || ''} onChange={(e) => setFormData({...formData, model: e.target.value})} style={inputStyle} required />
            <select value={formData.type || 'VAN_LARGE'} onChange={(e) => setFormData({...formData, type: e.target.value})} style={inputStyle}>
              <option value="VAN_SMALL">Van Small</option>
              <option value="VAN_LARGE">Van Large</option>
              <option value="TRUCK_LIGHT">Truck Light</option>
              <option value="TRUCK_HEAVY">Truck Heavy</option>
            </select>
            <select value={formData.status || 'AVAILABLE'} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>
              <option value="AVAILABLE">Available</option>
              <option value="ON_ROUTE">On Route</option>
              <option value="SERVICING">Servicing</option>
            </select>
          </>
        )
      case 'drivers':
        return (
          <>
            <input type="text" placeholder="Full Name *" value={formData.fullName || ''} onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={inputStyle} required />
            <input type="tel" placeholder="Phone *" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyle} required />
            <select value={formData.status || 'OFF_DUTY'} onChange={(e) => setFormData({...formData, status: e.target.value})} style={inputStyle}>
              <option value="OFF_DUTY">Off Duty</option>
              <option value="ON_DUTY">On Duty</option>
              <option value="ON_ROUTE">On Route</option>
            </select>
            <input type="number" step="0.1" placeholder="Rating (0-5)" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})} style={inputStyle} />
          </>
        )
      case 'warehouses':
        return (
          <>
            <input type="text" placeholder="Code *" value={formData.code || ''} onChange={(e) => setFormData({...formData, code: e.target.value})} style={inputStyle} required />
            <input type="text" placeholder="Name *" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
            <input type="number" step="any" placeholder="Latitude *" value={formData.latitude || ''} onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})} style={inputStyle} required />
            <input type="number" step="any" placeholder="Longitude *" value={formData.longitude || ''} onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})} style={inputStyle} required />
          </>
        )
      case 'inventory':
        return (
          <>
            <input type="text" placeholder="SKU *" value={formData.sku || ''} onChange={(e) => setFormData({...formData, sku: e.target.value})} style={inputStyle} required />
            <input type="text" placeholder="Title *" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} required />
            <input type="number" placeholder="Quantity" value={formData.quantity || 0} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} style={inputStyle} />
            <input type="number" step="0.1" placeholder="Weight (kg)" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} style={inputStyle} />
          </>
        )
      default:
        return <p>Form fields for this table coming soon</p>
    }
  }

  const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Database Manager</h1>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Dashboard</button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => setActiveTable(table.id)}
              style={{
                padding: '10px 20px',
                background: activeTable === table.id ? '#3b82f6' : 'white',
                color: activeTable === table.id ? 'white' : '#1a1a2e',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{table.icon}</span>
              <span>{table.name}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{tables.find(t => t.id === activeTable)?.name}</h2>
          <button onClick={handleAdd} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add New</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'auto', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  {data.length > 0 && Object.keys(data[0]).map(key => (
                    <th key={key} style={{ padding: '12px', textAlign: 'left', color: '#666', fontSize: '12px', fontWeight: '500' }}>{key.toUpperCase()}</th>
                  ))}
                  <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                    {Object.values(item).map((value, i) => (
                      <td key={i} style={{ padding: '12px', fontSize: '14px' }}>
                        {typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50)}
                      </td>
                    ))}
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button onClick={() => handleEdit(item)} style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan={10} style={{ padding: '60px', textAlign: 'center', color: '#666' }}>No data found. Click "Add New" to create.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>{editingItem ? 'Edit' : 'Add'} {tables.find(t => t.id === activeTable)?.name}</h2>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
