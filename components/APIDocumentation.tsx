'use client'

import { useState } from 'react'

export function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  const endpoints = [
    {
      path: '/api/orders',
      method: 'GET',
      description: 'Get all orders',
      parameters: [
        { name: 'status', type: 'string', description: 'Filter by order status' },
        { name: 'driverId', type: 'string', description: 'Filter by driver ID' }
      ],
      response: {
        orders: [
          {
            id: 'string',
            orderNumber: 'string',
            customerName: 'string',
            status: 'string',
            driverName: 'string'
          }
        ]
      }
    },
    {
      path: '/api/orders',
      method: 'POST',
      description: 'Create a new order',
      body: {
        customerName: 'string',
        customerEmail: 'string',
        deliveryAddress: 'string',
        pickupAddress: 'string'
      },
      response: {
        id: 'string',
        orderNumber: 'string',
        status: 'PENDING'
      }
    },
    {
      path: '/api/vehicles',
      method: 'GET',
      description: 'Get all vehicles',
      parameters: [
        { name: 'status', type: 'string', description: 'Filter by vehicle status' }
      ],
      response: {
        vehicles: [
          {
            id: 'string',
            registration: 'string',
            make: 'string',
            model: 'string',
            status: 'string'
          }
        ]
      }
    },
    {
      path: '/api/drivers',
      method: 'GET',
      description: 'Get all drivers',
      response: {
        drivers: [
          {
            id: 'string',
            name: 'string',
            email: 'string',
            status: 'string'
          }
        ]
      }
    },
    {
      path: '/api/fuel',
      method: 'GET',
      description: 'Get fuel logs',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'Filter by vehicle ID' }
      ],
      response: {
        fuelLogs: [
          {
            id: 'string',
            vehicleId: 'string',
            liters: 'number',
            cost: 'number',
            createdAt: 'string'
          }
        ]
      }
    },
    {
      path: '/api/fuel',
      method: 'POST',
      description: 'Log fuel consumption',
      body: {
        vehicleId: 'string',
        liters: 'number',
        cost: 'number',
        odometer: 'number'
      },
      response: {
        id: 'string',
        message: 'Fuel log created successfully'
      }
    },
    {
      path: '/api/maintenance',
      method: 'GET',
      description: 'Get maintenance records',
      parameters: [
        { name: 'vehicleId', type: 'string', description: 'Filter by vehicle ID' },
        { name: 'status', type: 'string', description: 'Filter by maintenance status' }
      ],
      response: {
        maintenance: [
          {
            id: 'string',
            vehicleId: 'string',
            type: 'string',
            description: 'string',
            status: 'string',
            dueDate: 'string'
          }
        ]
      }
    },
    {
      path: '/api/maintenance',
      method: 'POST',
      description: 'Schedule maintenance',
      body: {
        vehicleId: 'string',
        type: 'string',
        description: 'string',
        dueDate: 'string',
        priority: 'string'
      },
      response: {
        id: 'string',
        message: 'Maintenance scheduled successfully'
      }
    },
    {
      path: '/api/notifications',
      method: 'GET',
      description: 'Get notifications',
      response: {
        notifications: [
          {
            id: 'string',
            title: 'string',
            message: 'string',
            type: 'string',
            read: 'boolean'
          }
        ]
      }
    },
    {
      path: '/api/analytics/advanced',
      method: 'GET',
      description: 'Get advanced analytics data',
      parameters: [
        { name: 'range', type: 'string', description: 'Time range (7d, 30d, 90d, 1y)' }
      ],
      response: {
        totalRevenue: 'number',
        completedOrders: 'number',
        fleetUtilization: 'number',
        avgDeliveryTime: 'number'
      }
    }
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">API Documentation</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            📋 Export OpenAPI
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            🧪 Test API
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Endpoints</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {endpoints.map((endpoint, index) => (
              <button
                key={index}
                onClick={() => setSelectedEndpoint(`${endpoint.method}-${endpoint.path}`)}
                className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                  selectedEndpoint === `${endpoint.method}-${endpoint.path}` ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="text-sm font-medium truncate">{endpoint.path}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{endpoint.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            (() => {
              const [method, path] = selectedEndpoint.split('-', 2)
              const endpoint = endpoints.find(e => e.method === method && e.path === path)

              if (!endpoint) return <div>Endpoint not found</div>

              return (
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <h3 className="text-xl font-semibold">{endpoint.path}</h3>
                  </div>

                  <p className="text-gray-700 mb-6">{endpoint.description}</p>

                  {/* Parameters */}
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Parameters</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {endpoint.parameters.map((param, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <code className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">{param.name}</code>
                              <span className="text-sm text-gray-600 ml-2">({param.type})</span>
                            </div>
                            <span className="text-sm text-gray-700">{param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {endpoint.body && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3">Request Body</h4>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(endpoint.body, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Response */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Response</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>

                  {/* Try It */}
                  <div className="border-t pt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      🚀 Try this API
                    </button>
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">Select an endpoint</h3>
              <p>Choose an API endpoint from the list to view its documentation</p>
            </div>
          )}
        </div>
      </div>

      {/* API Base URL */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Base URL</h4>
        <code className="text-sm bg-white px-3 py-1 rounded border">
          https://your-domain.com/api
        </code>
        <p className="text-sm text-gray-600 mt-2">
          All API endpoints require authentication via JWT token in the Authorization header.
        </p>
      </div>
    </div>
  )
}