export interface Location {
  id: string;
  lat: number;
  lng: number;
  demand: number;
  timeWindowStart?: number;
  timeWindowEnd?: number;
  serviceTime?: number;
}

export interface Vehicle {
  id: string;
  capacity: number;
  startLocationId: string;
  endLocationId?: string;
}

export interface OptimizedRoute {
  vehicleId: string;
  stopIds: string[];
  totalDistance: number;
  totalDuration: number;
  totalDemand: number;
}

export class RoutingClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = process.env.ROUTING_SERVICE_URL || 'http://localhost:8001') {
    this.baseUrl = baseUrl;
  }
  
  async optimizeRoutes(
    locations: Location[],
    vehicles: Vehicle[],
    depotId: string,
    timeLimitSeconds: number = 30
  ): Promise<{ success: boolean; routes: OptimizedRoute[]; unrouted: string[]; totalDistance: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations,
          vehicles,
          depotId,
          timeLimitSeconds
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Routing optimization failed:', error);
      return { success: false, routes: [], unrouted: [], totalDistance: 0 };
    }
  }
  
  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  }
}

export const routingClient = new RoutingClient();

