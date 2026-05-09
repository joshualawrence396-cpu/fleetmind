'use client'

import { useState } from 'react'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration?: number
  error?: string
}

export function AutomatedTesting() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState('all')

  const testSuites = {
    all: 'All Tests',
    api: 'API Tests',
    database: 'Database Tests',
    integration: 'Integration Tests',
    performance: 'Performance Tests'
  }

  const testCases = [
    { name: 'User Authentication', suite: 'api', endpoint: '/api/login' },
    { name: 'Order Creation', suite: 'api', endpoint: '/api/orders' },
    { name: 'Vehicle Assignment', suite: 'api', endpoint: '/api/orders/assign' },
    { name: 'Fuel Log Creation', suite: 'api', endpoint: '/api/fuel' },
    { name: 'Maintenance Scheduling', suite: 'api', endpoint: '/api/maintenance' },
    { name: 'Notification System', suite: 'api', endpoint: '/api/notifications' },
    { name: 'Database Connection', suite: 'database', endpoint: 'prisma-connection' },
    { name: 'Data Integrity', suite: 'database', endpoint: 'data-validation' },
    { name: 'Order Fulfillment Flow', suite: 'integration', endpoint: 'order-workflow' },
    { name: 'Real-time Updates', suite: 'integration', endpoint: 'websocket-connection' },
    { name: 'API Response Time', suite: 'performance', endpoint: 'response-time' },
    { name: 'Concurrent Users', suite: 'performance', endpoint: 'load-test' }
  ]

  const runTests = async () => {
    setIsRunning(true)
    const filteredTests = selectedSuite === 'all'
      ? testCases
      : testCases.filter(test => test.suite === selectedSuite)

    const initialResults: TestResult[] = filteredTests.map(test => ({
      name: test.name,
      status: 'pending'
    }))

    setTestResults(initialResults)

    for (let i = 0; i < filteredTests.length; i++) {
      const test = filteredTests[i]
      const startTime = Date.now()

      // Update status to running
      setTestResults(prev => prev.map((result, idx) =>
        idx === i ? { ...result, status: 'running' } : result
      ))

      try {
        // Simulate API test
        const result = await runTest(test)
        const duration = Date.now() - startTime

        setTestResults(prev => prev.map((result, idx) =>
          idx === i ? {
            ...result,
            status: result.success ? 'passed' : 'failed',
            duration,
            error: result.error
          } : result
        ))

      } catch (error) {
        const duration = Date.now() - startTime
        setTestResults(prev => prev.map((result, idx) =>
          idx === i ? {
            ...result,
            status: 'failed',
            duration,
            error: error instanceof Error ? error.message : 'Unknown error'
          } : result
        ))
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const runTest = async (test: any) => {
    // Simulate different types of tests
    switch (test.endpoint) {
      case '/api/login':
        return await testAuthAPI()
      case '/api/orders':
        return await testOrderAPI()
      case '/api/fuel':
        return await testFuelAPI()
      case 'prisma-connection':
        return await testDatabaseConnection()
      case 'order-workflow':
        return await testOrderWorkflow()
      case 'response-time':
        return await testPerformance()
      default:
        // Generic API test
        const response = await fetch(test.endpoint)
        return { success: response.ok }
    }
  }

  const testAuthAPI = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@fleetmind.com', password: 'admin123' })
      })
      return { success: response.ok }
    } catch (error) {
      return { success: false, error: 'Authentication failed' }
    }
  }

  const testOrderAPI = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          deliveryAddress: '123 Test St',
          pickupAddress: '456 Source Ave'
        })
      })
      return { success: response.ok }
    } catch (error) {
      return { success: false, error: 'Order creation failed' }
    }
  }

  const testFuelAPI = async () => {
    try {
      const response = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: 'test-vehicle',
          liters: 50,
          cost: 750
        })
      })
      return { success: response.status === 201 || response.status === 200 }
    } catch (error) {
      return { success: false, error: 'Fuel logging failed' }
    }
  }

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/test-db')
      return { success: response.ok }
    } catch (error) {
      return { success: false, error: 'Database connection failed' }
    }
  }

  const testOrderWorkflow = async () => {
    // Simulate a complete order workflow test
    return { success: Math.random() > 0.3 } // 70% success rate for demo
  }

  const testPerformance = async () => {
    const startTime = Date.now()
    try {
      await fetch('/api/orders')
      const duration = Date.now() - startTime
      return { success: duration < 1000 } // Should respond within 1 second
    } catch (error) {
      return { success: false, error: 'Performance test failed' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'running': return '🔄'
      case 'passed': return '✅'
      case 'failed': return '❌'
      default: return '❓'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-gray-500'
      case 'running': return 'text-blue-500'
      case 'passed': return 'text-green-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const passedTests = testResults.filter(t => t.status === 'passed').length
  const failedTests = testResults.filter(t => t.status === 'failed').length
  const totalTests = testResults.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Automated Testing</h2>
        <div className="flex gap-2">
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
            disabled={isRunning}
          >
            {Object.entries(testSuites).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>
      </div>

      {/* Test Summary */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
            <div className="text-sm text-blue-800">Total Tests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-green-800">Passed</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedTests}</div>
            <div className="text-sm text-red-800">Failed</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-800">Success Rate</div>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(result.status)}</span>
                <div>
                  <h4 className={`font-medium ${getStatusColor(result.status)}`}>
                    {result.name}
                  </h4>
                  {result.duration && (
                    <p className="text-sm text-gray-500">
                      Duration: {result.duration}ms
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'passed' ? 'bg-green-100 text-green-800' :
                  result.status === 'failed' ? 'bg-red-100 text-red-800' :
                  result.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
            </div>
            {result.error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🧪</div>
          <h3 className="text-lg font-medium mb-2">No tests run yet</h3>
          <p>Select a test suite and click "Run Tests" to start automated testing</p>
        </div>
      )}

      {/* Test Configuration */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Test Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Environment
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Development</option>
              <option>Staging</option>
              <option>Production</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parallel Execution
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option>Sequential</option>
              <option>Parallel (2 threads)</option>
              <option>Parallel (4 threads)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}