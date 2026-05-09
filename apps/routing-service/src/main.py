from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from ortools.constraint_solver import routing_enums_pb2, pywrapcp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Location(BaseModel):
    id: str
    lat: float
    lng: float
    demand: int = 0
    time_window_start: int = 0
    time_window_end: int = 86400
    service_time: int = 300

class Vehicle(BaseModel):
    id: str
    capacity: int
    start_location_id: str
    end_location_id: Optional[str] = None

class OptimizationRequest(BaseModel):
    locations: List[Location]
    vehicles: List[Vehicle]
    depot_id: str
    time_limit_seconds: int = 30

class OptimizedRoute(BaseModel):
    vehicle_id: str
    stop_ids: List[str]
    total_distance: float
    total_duration: float
    total_demand: int

class OptimizationResponse(BaseModel):
    success: bool
    routes: List[OptimizedRoute]
    unrouted: List[str]
    total_distance: float
    total_duration: float
    computation_time: float

def calculate_distance_matrix(locations: List[Location]) -> np.ndarray:
    """Calculate distance matrix using haversine formula"""
    n = len(locations)
    matrix = np.zeros((n, n))
    
    for i in range(n):
        for j in range(n):
            if i != j:
                lat1, lon1 = locations[i].lat, locations[i].lng
                lat2, lon2 = locations[j].lat, locations[j].lng
                
                # Haversine formula
                R = 6371  # Earth's radius in km
                dlat = np.radians(lat2 - lat1)
                dlon = np.radians(lon2 - lon1)
                a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
                c = 2 * np.arcsin(np.sqrt(a))
                distance = R * c
                matrix[i][j] = distance
            else:
                matrix[i][j] = 0
                
    return matrix

def create_data_model(request: OptimizationRequest, distance_matrix: np.ndarray):
    """Create data model for OR-Tools"""
    data = {}
    data['distance_matrix'] = distance_matrix.tolist()
    
    # Demands (0 for depot)
    data['demands'] = [loc.demand for loc in request.locations]
    
    # Vehicle capacities
    data['vehicle_capacities'] = [v.capacity for v in request.vehicles]
    
    # Number of vehicles
    data['num_vehicles'] = len(request.vehicles)
    
    # Depot index
    depot_index = next(i for i, loc in enumerate(request.locations) if loc.id == request.depot_id)
    data['depot'] = depot_index
    
    return data

def solve_vrp(data):
    """Solve VRP using OR-Tools"""
    manager = pywrapcp.RoutingIndexManager(
        len(data['distance_matrix']), 
        data['num_vehicles'], 
        data['depot']
    )
    routing = pywrapcp.RoutingModel(manager)
    
    # Create distance callback
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(data['distance_matrix'][from_node][to_node] * 1000)  # Convert to meters
    
    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
    
    # Add capacity constraint
    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return data['demands'][from_node]
    
    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        data['vehicle_capacities'],  # vehicle maximum capacities
        True,  # start cumul to zero
        'Capacity'
    )
    
    # Add time windows
    time = 'Time'
    routing.AddDimension(
        transit_callback_index,
        86400,  # allow waiting time
        86400,  # maximum time per vehicle
        False,  # don't force start cumul to zero
        time
    )
    time_dimension = routing.GetDimensionOrDie(time)
    
    # Add time window constraints for each location
    for location_idx, location in enumerate(request.locations):
        index = manager.NodeToIndex(location_idx)
        time_dimension.CumulVar(index).SetRange(
            location.time_window_start,
            location.time_window_end
        )
    
    # Set first solution heuristic
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.seconds = request.time_limit_seconds
    
    # Solve the problem
    solution = routing.SolveWithParameters(search_parameters)
    
    if not solution:
        return None
    
    # Extract solution
    routes = []
    total_distance = 0
    total_duration = 0
    
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        stop_ids = []
        route_distance = 0
        route_duration = 0
        
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            stop_ids.append(request.locations[node_index].id)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
        
        node_index = manager.IndexToNode(index)
        stop_ids.append(request.locations[node_index].id)
        
        if len(stop_ids) > 2:  # More than just depot
            routes.append(OptimizedRoute(
                vehicle_id=request.vehicles[vehicle_id].id,
                stop_ids=stop_ids[1:-1],  # Exclude depot at start and end
                total_distance=route_distance / 1000,  # Convert back to km
                total_duration=route_duration,
                total_demand=sum(data['demands'][manager.NodeToIndex(idx)] for idx in stop_ids)
            ))
            total_distance += route_distance / 1000
    
    return routes, total_distance

@app.post("/api/optimize", response_model=OptimizationResponse)
async def optimize_routes(request: OptimizationRequest):
    try:
        import time
        start_time = time.time()
        
        # Calculate distance matrix
        distance_matrix = calculate_distance_matrix(request.locations)
        
        # Create data model
        data = create_data_model(request, distance_matrix)
        
        # Solve VRP
        result = solve_vrp(data)
        
        if result is None:
            return OptimizationResponse(
                success=False,
                routes=[],
                unrouted=[loc.id for loc in request.locations if loc.id != request.depot_id],
                total_distance=0,
                total_duration=0,
                computation_time=time.time() - start_time
            )
        
        routes, total_distance = result
        
        # Identify unrouted locations
        routed_ids = set()
        for route in routes:
            routed_ids.update(route.stop_ids)
        
        unrouted = [loc.id for loc in request.locations 
                   if loc.id != request.depot_id and loc.id not in routed_ids]
        
        return OptimizationResponse(
            success=True,
            routes=routes,
            unrouted=unrouted,
            total_distance=total_distance,
            total_duration=0,
            computation_time=time.time() - start_time
        )
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "routing-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
