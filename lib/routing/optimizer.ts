
interface Location {
  id: string;
  lat: number;
  lng: number;
  demand: number;
}

interface Vehicle {
  id: string;
  capacity: number;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Simple bin packing algorithm for vehicle assignment
interface RouteAssignment {
  vehicleId: string;
  stops: Location[];
  currentCapacity: number;
  totalDistance: number;
  stopIds?: string[];
}

function assignToVehicles(locations: Location[], vehicles: Vehicle[], depot: Location): RouteAssignment[] {
  // Sort locations by demand (largest first)
  const sorted = [...locations].sort((a, b) => b.demand - a.demand);
  const routes: RouteAssignment[] = [];
  
  for (const vehicle of vehicles) {
    routes.push({
      vehicleId: vehicle.id,
      stops: [],
      currentCapacity: vehicle.capacity,
      totalDistance: 0
    });
  }
  
  // Greedy assignment
  for (const location of sorted) {
    let bestRoute = -1;
    
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].currentCapacity >= location.demand) {
        bestRoute = i;
        break;
      }
    }
    
    if (bestRoute !== -1) {
      routes[bestRoute].stops.push(location);
      routes[bestRoute].currentCapacity -= location.demand;
    }
  }
  
  // Calculate distances for each route
  for (const route of routes) {
    if (route.stops.length > 0) {
      const points = [depot, ...route.stops, depot];
      let totalDistance = 0;
      for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(
          points[i].lat, points[i].lng,
          points[i+1].lat, points[i+1].lng
        );
      }
      route.totalDistance = totalDistance;
      route.stopIds = route.stops.map(s => s.id);
    }
  }
  
  return routes.filter(r => r.stops.length > 0);
}

export class RouteOptimizer {
  static optimize(locations: Location[], vehicles: Vehicle[], depot: Location) {
    try {
      // Separate depot from delivery locations
      const deliveryLocations = locations.filter(l => l.id !== depot.id);
      
      // Assign locations to vehicles
      const routes = assignToVehicles(deliveryLocations, vehicles, depot);
      
      // Optimize stop order within each route using TSP solver
      for (const route of routes) {
        if (route.stops.length > 2) {
          // Create distance matrix for stops in this route
          const stopPoints = [depot, ...route.stops];
          const distanceMatrix = stopPoints.map(from => 
            stopPoints.map(to => 
              calculateDistance(from.lat, from.lng, to.lat, to.lng)
            )
          );
          
          // Solve TSP for optimal order (simplified)
          // For production, use a proper TSP solver
          const optimizedOrder = this.simpleTSP(distanceMatrix);
          
          // Reorder stops based on TSP solution
          const reorderedStops = optimizedOrder.slice(1, -1).map(idx => route.stops[idx - 1]);
          route.stops = reorderedStops;
          route.stopIds = reorderedStops.map(s => s.id);
        }
      }
      
      const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
      const totalRouted = routes.reduce((sum, r) => sum + r.stops.length, 0);
      
      return {
        success: true,
        routes: routes.map(r => ({
          vehicleId: r.vehicleId,
          stopIds: r.stopIds,
          totalDistance: r.totalDistance,
          totalDemand: r.stops.reduce((sum, s) => sum + s.demand, 0)
        })),
        unrouted: [],
        totalDistance,
        totalRouted,
        computationTime: 0
      };
    } catch (error) {
      console.error('Optimization error:', error);
      return {
        success: false,
        routes: [],
        unrouted: locations.map(l => l.id),
        totalDistance: 0,
        totalRouted: 0,
        computationTime: 0
      };
    }
  }
  
  private static simpleTSP(distanceMatrix: number[][]): number[] {
    // Nearest neighbor algorithm for TSP
    const n = distanceMatrix.length;
    const visited = new Array(n).fill(false);
    const path = [0];
    visited[0] = true;
    
    for (let i = 1; i < n; i++) {
      let last = path[path.length - 1];
      let nearest = -1;
      let minDist = Infinity;
      
      for (let j = 0; j < n; j++) {
        if (!visited[j] && distanceMatrix[last][j] < minDist) {
          minDist = distanceMatrix[last][j];
          nearest = j;
        }
      }
      
      if (nearest !== -1) {
        path.push(nearest);
        visited[nearest] = true;
      }
    }
    
    path.push(0); // Return to depot
    return path;
  }
}




