import { NextResponse } from 'next/server'

export async function GET() {
  const vehicles = [
    { id: '1', registration: 'CA123456', make: 'Toyota', model: 'Hilux', status: 'ON_ROUTE', latitude: -33.9249, longitude: 18.4241, lastUpdate: new Date().toLocaleTimeString() },
    { id: '2', registration: 'CA789012', make: 'Ford', model: 'Ranger', status: 'AVAILABLE', latitude: -33.9229, longitude: 18.3859, lastUpdate: new Date().toLocaleTimeString() },
    { id: '3', registration: 'CY345678', make: 'Nissan', model: 'NP200', status: 'AVAILABLE', latitude: -33.9300, longitude: 18.4100, lastUpdate: new Date().toLocaleTimeString() }
  ]
  return NextResponse.json(vehicles)
}
