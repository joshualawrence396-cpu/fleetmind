'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CouriersPage() {
  const router = useRouter()
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'Bob Go', provider: 'BOB_GO', apiKey: '••••••••', rate: 50, status: 'Active' },
    { id: 2, name: 'Aramex', provider: 'ARAMEX', apiKey: '••••••••', rate: 80, status: 'Active' },
    { id: 3, name: 'DSV', provider: 'DSV', apiKey: '••••••••', rate: 100, status: 'Inactive' }
  ])
  const [showModal, setShowModal] = useState(false)
  const [newCourier, setNewCourier] = useState({ name: '', provider: '', apiKey: '', rate: 50 })

  const handleAddCourier = (e) => {
    e.preventDefault()
    const newId = Math.max(...couriers.map(c => c.id)) + 1
    setCouriers([...couriers, { ...newCourier, id: newId, status: 'Pending' }])
    setShowModal(false)
    setNewCourier({ name: '', provider: '', apiKey: '', rate: 50 })
    alert('Courier company added! Integration pending setup.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>FleetMind</h1>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>Logistics OS</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Courier Partners</h2>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Courier</button>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr><th style={{ padding: '12px', textAlign: 'left' }}>Name</th><th style={{ padding: '12px', textAlign: 'left' }}>Provider</th><th style={{ padding: '12px', textAlign: 'left' }}>API Key</th><th style={{ padding: '12px', textAlign: 'left' }}>Rate (R)</th><th style={{ padding: '12px', textAlign: 'left' }}>Status</th><th style={{ padding: '12px', textAlign: 'left' }}>Action</th></tr>
            </thead>
            <tbody>
              {couriers.map(courier => (
                <tr key={courier.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{courier.name}</td><td style={{ padding: '12px' }}>{courier.provider}</td><td style={{ padding: '12px' }}>{courier.apiKey}</td><td style={{ padding: '12px' }}>R{courier.rate}</td>
                  <td style={{ padding: '12px' }}><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: courier.status === 'Active' ? '#d1fae5' : '#fef3c7', color: courier.status === 'Active' ? '#065f46' : '#92400e' }}>{courier.status}</span></td>
                  <td style={{ padding: '12px' }}><button style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Configure</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Add Courier Company</h3>
            <form onSubmit={handleAddCourier}>
              <input type="text" placeholder="Company Name" value={newCourier.name} onChange={(e) => setNewCourier({...newCourier, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} required />
              <select value={newCourier.provider} onChange={(e) => setNewCourier({...newCourier, provider: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <option value="BOB_GO">Bob Go</option><option value="ARAMEX">Aramex</option><option value="DSV">DSV</option><option value="COURIER_GUY">Courier Guy</option>
              </select>
              <input type="text" placeholder="API Key" value={newCourier.apiKey} onChange={(e) => setNewCourier({...newCourier, apiKey: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <input type="number" placeholder="Base Rate (R)" value={newCourier.rate} onChange={(e) => setNewCourier({...newCourier, rate: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add Courier</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
