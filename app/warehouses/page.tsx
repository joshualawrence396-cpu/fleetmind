'use client'

import { useState, useEffect } from 'react'

export default function WarehouseDashboard() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/v1/warehouses')
      const data = await response.json()
      // Ensure data is an array
      setWarehouses(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      // Fallback data
      setWarehouses([
        { id: '1', code: 'MAIN-WH', name: 'Main Warehouse', location: 'Cape Town', status: 'Active' }
      ])
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading warehouses...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '32px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>Warehouse Management</h1>
        <p style={{ opacity: 0.9 }}>Manage your warehouse facilities</p>
      </div>

      {/* Warehouses Grid */}
      {warehouses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <p style={{ color: '#6b7280' }}>No warehouses found. Create your first warehouse.</p>
          <button 
            onClick={() => window.location.href = '/admin/warehouse'}
            style={{ marginTop: '20px', padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Create Warehouse
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '48px' }}>🏭</span>
              </div>
              
              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{warehouse.name}</h3>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>Code: {warehouse.code}</p>
                
                <div style={{ marginBottom: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: '#d1fae5',
                    color: '#065f46'
                  }}>
                    {warehouse.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    <strong>Location:</strong> Lat {warehouse.latitude}, Lng {warehouse.longitude}
                  </p>
                  {warehouse.totalArea && (
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                      <strong>Area:</strong> {warehouse.totalArea} m²
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
