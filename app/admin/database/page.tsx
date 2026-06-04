'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type TableRow = Record<string, any>

type TableConfig = {
  id: string
  name: string
  icon: string
  api: string
}

export default function DatabaseManager() {
  const router = useRouter()

  const [activeTable, setActiveTable] = useState<string>('vehicles')
  const [data, setData] = useState<TableRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<TableRow | null>(null)
  const [formData, setFormData] = useState<TableRow>({})

  const tables: TableConfig[] = [
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
      const table = tables.find((t) => t.id === activeTable)

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

  const handleEdit = (item: TableRow) => {
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const table = tables.find((t) => t.id === activeTable)

      if (!table) return

      const res = await fetch(`${table.api}/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Item deleted successfully')
        fetchData()
      } else {
        alert('Failed to delete item')
      }
    } catch (error) {
      console.error(error)
      alert('Error deleting item')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const table = tables.find((t) => t.id === activeTable)

      if (!table) return

      const method = editingItem ? 'PUT' : 'POST'
      const url =
        editingItem && editingItem.id
          ? `${table.api}/${editingItem.id}`
          : table.api

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert(
          editingItem
            ? 'Item updated successfully'
            : 'Item added successfully'
        )

        setShowModal(false)
        fetchData()
      } else {
        alert('Operation failed')
      }
    } catch (error) {
      console.error(error)
      alert('Error processing request')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px'
  }

  const renderFormFields = () => {
    switch (activeTable) {
      case 'vehicles':
        return (
          <>
            <input
              type="text"
              placeholder="Registration *"
              value={formData.registration || ''}
              onChange={(e) =>
                setFormData({ ...formData, registration: e.target.value })
              }
              style={inputStyle}
              required
            />

            <input
              type="text"
              placeholder="Make *"
              value={formData.make || ''}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              style={inputStyle}
              required
            />

            <input
              type="text"
              placeholder="Model *"
              value={formData.model || ''}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              style={inputStyle}
              required
            />
          </>
        )

      case 'drivers':
        return (
          <>
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.fullName || ''}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              style={inputStyle}
              required
            />
          </>
        )

      default:
        return <p>Form fields for this table coming soon</p>
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Database Manager
          </h1>

          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '8px 16px',
              background: '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '32px 24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTable(table.id)}
            >
              {table.icon} {table.name}
            </button>
          ))}
        </div>

        <button onClick={handleAdd}>+ Add New</button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item: TableRow, idx: number) => (
                <tr key={idx}>
                  {Object.values(item).map((value: any, i: number) => (
                    <td key={i}>
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)}
                    </td>
                  ))}

                  <td>
                    <button onClick={() => handleEdit(item)}>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}

            <button type="submit">Save</button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}