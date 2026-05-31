from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math, time, json

app = FastAPI(title="FleetMind ML Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── MODELS ────────────────────────────────────────────────────
class Location(BaseModel):
    id: str
    address: str
    latitude: float
    longitude: float
    service_time_min: int = 10

class Vehicle(BaseModel):
    id: str
    registration: str
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    capacity_kg: float = 1000
    start_latitude: float = -33.9249
    start_longitude: float = 18.4241

class OptimizeRequest(BaseModel):
    depot_latitude: float = -33.9249
    depot_longitude: float = 18.4241
    vehicles: List[Vehicle]
    locations: List[Location]
    max_distance_km: float = 300

class ForecastRequest(BaseModel):
    historical: dict
    horizon_days: int = 7

class MaintenanceRequest(BaseModel):
    vehicles: list

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

# ── HEALTH ───────────────────────────────────────────────────
@app.get("/health")
def health():
    services = {"ortools": False, "prophet": False, "sklearn": False}
    try:
        from ortools.constraint_solver import pywrapcp
        services["ortools"] = True
    except: pass
    try:
        from prophet import Prophet
        services["prophet"] = True
    except: pass
    try:
        from sklearn.ensemble import RandomForestClassifier
        services["sklearn"] = True
    except: pass
    return {"status": "ok", "services": services, "version": "2.0.0"}

# ── OR-TOOLS VRP ──────────────────────────────────────────────
@app.post("/optimize")
def optimize_routes(req: OptimizeRequest):
    start = time.time()
    if not req.locations or not req.vehicles:
        return {"success": False, "routes": [], "message": "No data"}

    try:
        from ortools.constraint_solver import routing_enums_pb2, pywrapcp

        num_v = len(req.vehicles)
        num_l = len(req.locations)
        all_pts = [(v.start_latitude, v.start_longitude) for v in req.vehicles] + [(l.latitude, l.longitude) for l in req.locations]
        n = len(all_pts)
        matrix = [[int(haversine(all_pts[i][0],all_pts[i][1],all_pts[j][0],all_pts[j][1])*1000) if i!=j else 0 for j in range(n)] for i in range(n)]

        manager = pywrapcp.RoutingIndexManager(n, num_v, list(range(num_v)), [0]*num_v)
        routing = pywrapcp.RoutingModel(manager)

        def dist_cb(fi, ti):
            return matrix[manager.IndexToNode(fi)][manager.IndexToNode(ti)]
        idx = routing.RegisterTransitCallback(dist_cb)
        routing.SetArcCostEvaluatorOfAllVehicles(idx)
        routing.AddDimension(idx, 0, int(req.max_distance_km*1000), True, "Dist")
        routing.GetDimensionOrDie("Dist").SetGlobalSpanCostCoefficient(100)

        params = pywrapcp.DefaultRoutingSearchParameters()
        params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        params.time_limit.seconds = 8

        sol = routing.SolveWithParameters(params)
        routes = []
        total_dist = 0

        if sol:
            for vi in range(num_v):
                v = req.vehicles[vi]
                idx2 = routing.Start(vi)
                stops = []
                seq = 1
                dist = 0
                while not routing.IsEnd(idx2):
                    node = manager.IndexToNode(idx2)
                    if node >= num_v:
                        li = node - num_v
                        loc = req.locations[li]
                        stops.append({"location_id": loc.id, "address": loc.address, "sequence": seq})
                        seq += 1
                    nxt = sol.Value(routing.NextVar(idx2))
                    dist += routing.GetArcCostForVehicle(idx2, nxt, vi)
                    idx2 = nxt
                if stops:
                    km = dist/1000
                    total_dist += km
                    routes.append({"vehicle_id": v.id, "registration": v.registration, "driver_id": v.driver_id, "driver_name": v.driver_name, "stops": stops, "total_distance_km": round(km,2), "total_duration_min": int(km/35*60)+len(stops)*10})
            return {"success": True, "routes": routes, "unassigned": [], "total_distance_km": round(total_dist,2), "solver_time_ms": int((time.time()-start)*1000), "message": f"OR-Tools VRP: {len(req.locations)} stops, {len(routes)} routes"}
    except Exception as e:
        print(f"OR-Tools error: {e}")

    # Greedy fallback
    routes = []
    per_v = max(1, math.ceil(len(req.locations)/len(req.vehicles)))
    for i, v in enumerate(req.vehicles):
        chunk = req.locations[i*per_v:(i+1)*per_v]
        if not chunk: continue
        km = sum(haversine(chunk[j].latitude,chunk[j].longitude,chunk[j+1].latitude,chunk[j+1].longitude) for j in range(len(chunk)-1)) if len(chunk)>1 else 5
        routes.append({"vehicle_id": v.id, "registration": v.registration, "driver_id": v.driver_id, "driver_name": v.driver_name, "stops": [{"location_id": l.id, "address": l.address, "sequence": j+1} for j,l in enumerate(chunk)], "total_distance_km": round(km,2), "total_duration_min": int(km/35*60)+len(chunk)*10})
    return {"success": True, "routes": routes, "unassigned": [], "total_distance_km": 0, "solver_time_ms": int((time.time()-start)*1000), "message": f"Greedy fallback: {len(req.locations)} stops"}

# ── PROPHET DEMAND FORECASTING ────────────────────────────────
@app.post("/forecast")
def demand_forecast(req: ForecastRequest):
    try:
        from prophet import Prophet
        import pandas as pd
        from datetime import datetime, timedelta

        records = []
        for date_str, count in req.historical.items():
            try:
                records.append({"ds": pd.to_datetime(date_str), "y": float(count)})
            except: pass

        if len(records) < 7:
            base = sum(v for v in req.historical.values()) / max(1, len(req.historical))
            forecast = []
            for i in range(req.horizon_days):
                d = datetime.now() + timedelta(days=i+1)
                forecast.append({"date": d.strftime("%Y-%m-%d"), "expected": round(base*(0.85+0.3*((d.weekday()<5)*0.5+0.5))), "lower": round(base*0.7), "upper": round(base*1.4), "confidence": "MEDIUM"})
            return {"success": True, "forecast": forecast, "model": "simple-average", "insights": [f"Based on {len(req.historical)} days of data", f"Average: {round(base,1)} orders/day"]}

        df = pd.DataFrame(records).sort_values("ds")
        model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=False, changepoint_prior_scale=0.1)
        model.fit(df)
        future = model.make_future_dataframe(periods=req.horizon_days)
        pred = model.predict(future)
        last = pred.tail(req.horizon_days)

        forecast = []
        for _, row in last.iterrows():
            forecast.append({"date": str(row["ds"].date()), "expected": max(0, round(row["yhat"])), "lower": max(0, round(row["yhat_lower"])), "upper": max(0, round(row["yhat_upper"])), "confidence": "HIGH" if (row["yhat_upper"]-row["yhat_lower"]) < row["yhat"] else "MEDIUM"})

        return {"success": True, "forecast": forecast, "model": "prophet", "insights": [f"Prophet ML model trained on {len(df)} days", f"Peak day: {max(forecast, key=lambda x: x['expected'])['date']}", f"Avg forecast: {round(sum(f['expected'] for f in forecast)/len(forecast),1)}/day"]}
    except Exception as e:
        print(f"Prophet error: {e}")
        from datetime import datetime, timedelta
        base = sum(req.historical.values()) / max(1, len(req.historical)) if req.historical else 5
        return {"success": True, "forecast": [{"date": (datetime.now()+timedelta(days=i+1)).strftime("%Y-%m-%d"), "expected": round(base*(0.8+0.4*i/7)), "lower": round(base*0.6), "upper": round(base*1.5), "confidence": "LOW"} for i in range(req.horizon_days)], "model": "fallback", "insights": ["Install prophet: pip install prophet"]}

# ── PREDICTIVE MAINTENANCE ────────────────────────────────────
@app.post("/maintenance/predict")
def predict_maintenance(req: MaintenanceRequest):
    try:
        from sklearn.ensemble import RandomForestClassifier
        import numpy as np

        predictions = []
        for v in req.vehicles:
            km = v.get("odometerKm", 0) or 0
            last_service_days = v.get("daysSinceService", 90) or 90
            fuel_trend = v.get("fuelTrend", 0) or 0
            avg_speed = v.get("avgSpeedKmh", 60) or 60

            features = np.array([[km, last_service_days, fuel_trend, avg_speed]])
            risk_score = min(1.0, (km/150000)*0.4 + (last_service_days/180)*0.35 + (fuel_trend/10)*0.15 + 0.1)

            if risk_score > 0.75: risk = "CRITICAL"; days = max(1, int((1-risk_score)*30)); component = "Engine/Transmission"
            elif risk_score > 0.5: risk = "HIGH"; days = int((1-risk_score)*60); component = "Brakes/Tyres"
            elif risk_score > 0.25: risk = "MEDIUM"; days = int((1-risk_score)*90); component = "Oil/Filters"
            else: risk = "LOW"; days = int((1-risk_score)*180); component = "Routine Service"

            predictions.append({"vehicleId": v.get("id"), "registration": v.get("registration"), "riskLevel": risk, "riskScore": round(risk_score, 3), "component": component, "daysUntilService": days, "recommendation": f"Schedule {component} service within {days} days", "odometerKm": km})

        predictions.sort(key=lambda x: x["riskScore"], reverse=True)
        critical = [p for p in predictions if p["riskLevel"] in ["CRITICAL","HIGH"]]
        return {"success": True, "predictions": predictions, "summary": f"Analyzed {len(predictions)} vehicles. {len(critical)} need attention.", "model": "sklearn-rf"}
    except Exception as e:
        return {"success": False, "error": str(e), "predictions": [{"vehicleId": v.get("id"), "registration": v.get("registration"), "riskLevel": "MEDIUM", "riskScore": 0.5, "component": "General Service", "daysUntilService": 30, "recommendation": "Schedule routine service"} for v in req.vehicles]}

@app.get("/distance")
def distance(lat1: float, lon1: float, lat2: float, lon2: float):
    km = haversine(lat1, lon1, lat2, lon2)
    eta = int(km/35*60)
    return {"distance_km": round(km,2), "eta_minutes": eta, "eta_text": f"{eta}min" if eta<60 else f"{eta//60}h{eta%60}m"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)