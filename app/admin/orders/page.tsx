'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const router = useRouter()
  interface Order {
  id?: string
  recipientName?: string
  trackingNumber?: string
  status?: string
  origin?: {
    address?: string
  }
  destination?: {
    address?: string
  }
}
const [orders, setOrders] = useState<Order[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [newOrder, setNewOrder] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    pickupAddress: '',
    pickupCity: 'Cape Town',
    pickupPostalCode: '8001',
    deliveryAddress: '',
    deliveryCity: 'Cape Town',
    deliveryPostalCode: '8001',
    serviceLevel: 'STANDARD',
    items: [{ description: 'Package', weight: 1, quantity: 1 }]
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/v1/orders')
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  // Geocode address function
  const geocodeAddress = async (
  address: string,
  city: string,
  postalCode: string
) => {
    const fullAddress = address + ', ' + city + ', ' + postalCode + ', South Africa'
    // Simulate geocoding - in production use Google Maps API
    return {
      lat: -33.9249 + (Math.random() - 0.5) * 0.1,
      lng: 18.4241 + (Math.random() - 0.5) * 0.1,
      formatted: fullAddress
    }
  }

  const handleCreateOrder = async (
  e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault()
    setLoading(true)
    setGeocoding(true)
    
    try {
      // Geocode both addresses
      const [pickupGeo, deliveryGeo] = await Promise.all([
        geocodeAddress(newOrder.pickupAddress, newOrder.pickupCity, newOrder.pickupPostalCode),
        geocodeAddress(newOrder.deliveryAddress, newOrder.deliveryCity, newOrder.deliveryPostalCode)
      ])
      
      setGeocoding(false)
      
      const orderData = {
        idempotencyKey: 'order-' + Date.now(),
        serviceLevel: newOrder.serviceLevel,
        origin: {
          address: newOrder.pickupAddress,
          city: newOrder.pickupCity,
          postalCode: newOrder.pickupPostalCode,
          country: 'ZA',
          latitude: pickupGeo.lat,
          longitude: pickupGeo.lng,
          formatted: pickupGeo.formatted
        },
        destination: {
          address: newOrder.deliveryAddress,
          city: newOrder.deliveryCity,
          postalCode: newOrder.deliveryPostalCode,
          country: 'ZA',
          latitude: deliveryGeo.lat,
          longitude: deliveryGeo.lng,
          formatted: deliveryGeo.formatted
        },
        recipient: {
          name: newOrder.recipientName,
          email: newOrder.recipientEmail,
          phone: newOrder.recipientPhone
        },
        items: newOrder.items,
        declaredValue: 100,
        paymentTerms: 'PREPAID'
      }
      
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (response.ok) {
        const result = await response.json()
        const trackingNumber = result.shipment?.trackingNumber || 'N/A'
        alert('Order created successfully!\nTracking Number: ' + trackingNumber + '\nPickup: ' + pickupGeo.formatted + '\nDelivery: ' + deliveryGeo.formatted)
        setShowModal(false)
        resetForm()
        fetchOrders()
      } else {
        const error = await response.json()
        alert('Failed to create order: ' + (error.error || 'Unknown error'))
      }
    } catch (error: unknown) {
  console.error('Error:', error)

  const message =
    error instanceof Error
      ? error.message
      : 'Unknown error'

  alert('Error creating order: ' + message)
} finally {
      setLoading(false)
      setGeocoding(false)
    }
  }

  const resetForm = () => {
    setNewOrder({
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
      pickupAddress: '',
      pickupCity: 'Cape Town',
      pickupPostalCode: '8001',
      deliveryAddress: '',
      deliveryCity: 'Cape Town',
      deliveryPostalCode: '8001',
      serviceLevel: 'STANDARD',
      items: [{ description: 'Package', weight: 1, quantity: 1 }]
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>FleetMind</h1>
        <p style={{ fontSize: '12px', color: '#6b7280' }}>Logistics OS</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header with Create Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Order Management</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Create Order
          </button>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Recipient</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Pickup</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Delivery</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{order.id?.slice(-6) || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{order.recipientName || 'N/A'}</td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {(order.origin?.address || '').substring(0, 30)}...
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px' }}>
                    {(order.destination?.address || '').substring(0, 30)}...
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: order.status === 'DELIVERED' ? '#d1fae5' : '#fef3c7',
                      color: order.status === 'DELIVERED' ? '#065f46' : '#92400e'
                    }}>
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{order.trackingNumber || 'N/A'}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    No orders yet. Click "Create Order" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Create New Order</h3>
            
            {(geocoding || loading) && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                zIndex: 10
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: '12px' }}>{geocoding ? 'Validating addresses...' : 'Creating order...'}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleCreateOrder}>
              {/* Recipient Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#3b82f6' }}>Recipient Information</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name *</label>
                  <input
                    type="text"
                    value={newOrder.recipientName}
                    onChange={(e) => setNewOrder({...newOrder, recipientName: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={newOrder.recipientPhone}
                    onChange={(e) => setNewOrder({...newOrder, recipientPhone: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email (Optional)</label>
                  <input
                    type="email"
                    value={newOrder.recipientEmail}
                    onChange={(e) => setNewOrder({...newOrder, recipientEmail: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Pickup Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#10b981' }}>Pickup Location</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Street Address *</label>
                  <input
                    type="text"
                    placeholder="8 Edison Lane"
                    value={newOrder.pickupAddress}
                    onChange={(e) => setNewOrder({...newOrder, pickupAddress: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>City</label>
                    <input
                      type="text"
                      value={newOrder.pickupCity}
                      onChange={(e) => setNewOrder({...newOrder, pickupCity: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Postal Code</label>
                    <input
                      type="text"
                      value={newOrder.pickupPostalCode}
                      onChange={(e) => setNewOrder({...newOrder, pickupPostalCode: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '12px', color: '#f59e0b' }}>Delivery Location</h4>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Street Address *</label>
                  <input
                    type="text"
                    placeholder="456 Oak Ave"
                    value={newOrder.deliveryAddress}
                    onChange={(e) => setNewOrder({...newOrder, deliveryAddress: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>City</label>
                    <input
                      type="text"
                      value={newOrder.deliveryCity}
                      onChange={(e) => setNewOrder({...newOrder, deliveryCity: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Postal Code</label>
                    <input
                      type="text"
                      value={newOrder.deliveryPostalCode}
                      onChange={(e) => setNewOrder({...newOrder, deliveryPostalCode: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Service Level */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Service Level</label>
                <select
                  value={newOrder.serviceLevel}
                  onChange={(e) => setNewOrder({...newOrder, serviceLevel: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="STANDARD">Standard (2-3 days) - R50</option>
                  <option value="EXPRESS">Express (1-2 days) - R80</option>
                  <option value="SAME_DAY">Same Day - R150</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading || geocoding}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Creating...' : geocoding ? 'Validating Address...' : 'Create Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
